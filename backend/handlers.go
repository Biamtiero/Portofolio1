package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/mail"
	"strings"
	"time"
	"unicode/utf8"
)

type Server struct {
	store   *Store
	limiter *RateLimiter
}

type ContactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
	// Honeypot: field tersembunyi di form. Manusia tidak mengisinya, bot spam biasanya mengisi.
	Website string `json:"website"`
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *Server) handlePortfolio(w http.ResponseWriter, r *http.Request) {
	data, err := s.store.Portfolio()
	if err != nil {
		log.Printf("gagal membaca portfolio: %v", err)
		writeError(w, http.StatusInternalServerError, "Gagal memuat data portofolio")
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache")
	w.Write(data)
}

func (s *Server) handleContact(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 16<<10) // maks 16 KB

	var req ContactRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Format data tidak valid")
		return
	}

	// Bot terdeteksi: pura-pura sukses agar bot tidak mencoba lagi.
	if req.Website != "" {
		writeJSON(w, http.StatusOK, map[string]string{"message": "Pesan terkirim"})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	req.Message = strings.TrimSpace(req.Message)

	if msg := validateContact(req); msg != "" {
		writeError(w, http.StatusUnprocessableEntity, msg)
		return
	}

	if !s.limiter.Allow(clientIP(r)) {
		writeError(w, http.StatusTooManyRequests, "Terlalu banyak pesan. Coba lagi beberapa menit lagi.")
		return
	}

	msg := Message{
		Name:      req.Name,
		Email:     req.Email,
		Message:   req.Message,
		CreatedAt: time.Now().UTC(),
	}
	if err := s.store.SaveMessage(msg); err != nil {
		log.Printf("gagal menyimpan pesan: %v", err)
		writeError(w, http.StatusInternalServerError, "Gagal menyimpan pesan")
		return
	}

	log.Printf("pesan baru dari %s <%s>", msg.Name, msg.Email)
	writeJSON(w, http.StatusCreated, map[string]string{"message": "Terima kasih! Pesanmu sudah terkirim."})
}

func validateContact(req ContactRequest) string {
	switch {
	case req.Name == "" || utf8.RuneCountInString(req.Name) > 100:
		return "Nama wajib diisi (maks 100 karakter)"
	case req.Email == "" || len(req.Email) > 254:
		return "Email wajib diisi"
	case !isValidEmail(req.Email):
		return "Format email tidak valid"
	case utf8.RuneCountInString(req.Message) < 10:
		return "Pesan minimal 10 karakter"
	case utf8.RuneCountInString(req.Message) > 2000:
		return "Pesan maksimal 2000 karakter"
	}
	return ""
}

func isValidEmail(email string) bool {
	addr, err := mail.ParseAddress(email)
	return err == nil && addr.Address == email && strings.Contains(email, ".")
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}
