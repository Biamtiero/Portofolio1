package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"
)

func main() {
	// Semua konfigurasi diambil dari environment variable,
	// supaya mudah diatur saat deploy (Railway, Render, VPS, dll).
	port := getenv("PORT", "8080")
	dataDir := getenv("DATA_DIR", "data")
	staticDir := os.Getenv("STATIC_DIR") // isi dengan folder hasil build React saat production
	allowedOrigins := splitAndTrim(getenv("ALLOWED_ORIGINS", "http://localhost:5173"))

	store, err := NewStore(dataDir)
	if err != nil {
		log.Fatalf("gagal menyiapkan data store: %v", err)
	}

	srv := &Server{
		store:   store,
		limiter: NewRateLimiter(5, 10*time.Minute), // maks 5 pesan / 10 menit per IP
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", srv.handleHealth)
	mux.HandleFunc("GET /api/portfolio", srv.handlePortfolio)
	mux.HandleFunc("POST /api/contact", srv.handleContact)

	// Mode production: Go sekaligus menyajikan file React (single deploy).
	if staticDir != "" {
		mux.Handle("/", spaHandler(staticDir))
		log.Printf("menyajikan frontend dari %q", staticDir)
	}

	httpServer := &http.Server{
		Addr:              ":" + port,
		Handler:           logRequests(cors(allowedOrigins, mux)),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	// Jalankan server di goroutine agar bisa graceful shutdown.
	go func() {
		log.Printf("backend berjalan di http://localhost:%s", port)
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server error: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	log.Println("mematikan server...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := httpServer.Shutdown(ctx); err != nil {
		log.Printf("shutdown error: %v", err)
	}
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func splitAndTrim(s string) []string {
	var out []string
	for _, part := range strings.Split(s, ",") {
		if p := strings.TrimSpace(part); p != "" {
			out = append(out, p)
		}
	}
	return out
}
