# ---------- Tahap 1: build frontend React ----------
FROM node:22-alpine AS frontend
WORKDIR /app/frontend
RUN corepack enable
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm build

# ---------- Tahap 2: build backend Go ----------
FROM golang:1.24-alpine AS backend
WORKDIR /app/backend
COPY backend/go.mod ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /server .

# ---------- Tahap 3: image final yang kecil ----------
FROM alpine:3.20
WORKDIR /app
RUN adduser -D -u 10001 appuser
COPY --from=backend /server ./server
COPY --from=frontend /app/frontend/dist ./public
COPY backend/data ./data
RUN chown -R appuser /app
USER appuser

ENV PORT=8080 \
    STATIC_DIR=/app/public \
    DATA_DIR=/app/data
EXPOSE 8080
CMD ["./server"]
