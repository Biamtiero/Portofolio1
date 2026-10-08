// Alamat backend. Kosong = sama dengan domain frontend (dev pakai proxy Vite,
// production bisa disajikan oleh Go). Isi VITE_API_URL jika backend di domain lain.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Terjadi kesalahan (${res.status})`)
  }
  return data
}

export const getPortfolio = () => request('/api/portfolio')

export const sendMessage = (payload) =>
  request('/api/contact', { method: 'POST', body: JSON.stringify(payload) })
