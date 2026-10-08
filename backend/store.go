package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"
)

type Message struct {
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"createdAt"`
}

// Store menyimpan data di file JSON (tanpa database).
type Store struct {
	portfolioPath string
	messagesPath  string
	mu            sync.Mutex
}

func NewStore(dataDir string) (*Store, error) {
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		return nil, err
	}
	s := &Store{
		portfolioPath: filepath.Join(dataDir, "portfolio.json"),
		messagesPath:  filepath.Join(dataDir, "messages.json"),
	}
	// Pastikan portfolio.json ada & valid saat server start.
	if _, err := s.Portfolio(); err != nil {
		return nil, err
	}
	return s, nil
}

// Portfolio membaca file setiap request, jadi perubahan pada portfolio.json
// langsung terlihat tanpa perlu restart server.
func (s *Store) Portfolio() ([]byte, error) {
	data, err := os.ReadFile(s.portfolioPath)
	if err != nil {
		return nil, fmt.Errorf("membaca %s: %w", s.portfolioPath, err)
	}
	if !json.Valid(data) {
		return nil, fmt.Errorf("%s bukan JSON yang valid", s.portfolioPath)
	}
	return data, nil
}

func (s *Store) SaveMessage(m Message) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	var messages []Message
	data, err := os.ReadFile(s.messagesPath)
	switch {
	case err == nil:
		if len(data) > 0 {
			if err := json.Unmarshal(data, &messages); err != nil {
				return fmt.Errorf("membaca messages.json: %w", err)
			}
		}
	case !errors.Is(err, os.ErrNotExist):
		return err
	}

	messages = append(messages, m)
	out, err := json.MarshalIndent(messages, "", "  ")
	if err != nil {
		return err
	}

	// Tulis ke file sementara lalu rename, agar file tidak rusak jika proses terhenti.
	tmp := s.messagesPath + ".tmp"
	if err := os.WriteFile(tmp, out, 0o644); err != nil {
		return err
	}
	return os.Rename(tmp, s.messagesPath)
}
