# Portofolio: React + Go

Website portofolio pribadi dengan **frontend React (Vite)** dan **backend Go** (tanpa library eksternal).

```
PORTOFOLIO/
├── backend/                 # API Go
│   ├── main.go              # entry point & konfigurasi
│   ├── handlers.go          # endpoint API
│   ├── store.go             # baca/tulis file JSON
│   ├── middleware.go        # CORS, logging, rate limit
│   └── data/
│       ├── portfolio.json   # ✏️ EDIT FILE INI untuk mengisi data kamu
│       └── messages.json    # pesan dari form kontak (dibuat otomatis)
├── frontend/                # React + Vite
│   └── src/components/      # Hero, About, Skills, Projects, Experience, Contact
└── Dockerfile               # untuk deploy (1 service: Go menyajikan API + React)
```

## ▶️ Menjalankan di komputer (development)

Buka **2 terminal**:

```powershell
# Terminal 1: backend (http://localhost:8080)
cd C:\PORTOFOLIO\backend
go run .
```

```powershell
# Terminal 2: frontend (http://localhost:5173)
cd C:\PORTOFOLIO\frontend
pnpm install   # cukup sekali
pnpm dev
```

Buka **http://localhost:5173** di browser.

## ✏️ Mengganti data

Semua konten ada di [`backend/data/portfolio.json`](backend/data/portfolio.json): nama, bio, skill, project, pengalaman, sosial media.
Simpan file, lalu refresh browser. Server **tidak perlu di-restart**.

- **Foto profil**: taruh file di `frontend/public/` (misal `foto.jpg`), lalu isi `"avatar": "/foto.jpg"`
- **Gambar project**: taruh di `frontend/public/projects/`, lalu isi `"image": "/projects/nama.png"`
- **CV**: taruh `cv.pdf` di `frontend/public/`, lalu isi `"resumeUrl": "/cv.pdf"`

Pesan dari form kontak tersimpan di `backend/data/messages.json`.

## 🔌 API

| Method | Endpoint          | Keterangan                    |
|--------|-------------------|-------------------------------|
| GET    | `/api/health`     | Cek server hidup              |
| GET    | `/api/portfolio`  | Ambil semua data portofolio   |
| POST   | `/api/contact`    | Kirim pesan `{name, email, message}` |

## ⚙️ Environment variable (backend)

| Nama              | Default                  | Keterangan |
|-------------------|--------------------------|------------|
| `PORT`            | `8080`                   | Port server |
| `DATA_DIR`        | `data`                   | Folder file JSON |
| `STATIC_DIR`      | *(kosong)*               | Folder hasil build React. Jika diisi, Go juga menyajikan frontend |
| `ALLOWED_ORIGINS` | `http://localhost:5173`  | Domain frontend yang boleh memanggil API (pisahkan dengan koma) |

Frontend: `VITE_API_URL` (opsional) berisi URL backend jika frontend & backend di-deploy terpisah.

## 🚀 Deploy

### Opsi 1 (paling mudah): 1 service dengan Docker (Railway / Render / Fly.io)
`Dockerfile` sudah membangun React + Go menjadi satu aplikasi.
1. Push project ke GitHub
2. Di [Railway](https://railway.app) atau [Render](https://render.com): **New → Deploy from GitHub repo**
3. Platform otomatis mendeteksi `Dockerfile` → deploy → dapat URL publik 🎉

> ⚠️ Di hosting gratis, file `messages.json` bisa hilang saat redeploy. Tambahkan **Volume/Disk** dan arahkan `DATA_DIR` ke sana, atau ganti dengan database nanti.

### Opsi 2: frontend & backend terpisah
- **Frontend → Vercel/Netlify**: root directory `frontend`, build `pnpm build`, output `dist`, env `VITE_API_URL=https://backend-kamu.up.railway.app`
- **Backend → Railway/Render**: root directory `backend`, env `ALLOWED_ORIGINS=https://portofolio-kamu.vercel.app`

### Uji versi production di lokal
```powershell
cd C:\PORTOFOLIO\frontend; pnpm build
cd C:\PORTOFOLIO\backend; $env:STATIC_DIR="..\frontend\dist"; go run .
# buka http://localhost:8080
```
