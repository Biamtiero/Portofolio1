import { useState } from 'react'
import { sendMessage } from '../api'
import { useReveal } from '../useReveal'
import { SectionTitle } from './About'
import { MailIcon, SocialIcon } from './Icons'

const EMPTY = { name: '', email: '', message: '', website: '' }

export default function Contact({ profile }) {
  const ref = useReveal()
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState({ type: 'idle', text: '' })

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: 'loading', text: '' })
    try {
      const res = await sendMessage(form)
      setStatus({ type: 'success', text: res.message })
      setForm(EMPTY)
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    }
  }

  return (
    <section id="contact" className="section" ref={ref}>
      <div className="container">
        <SectionTitle eyebrow="05" title="Hubungi Saya" subtitle="Punya project, tawaran kerja, atau sekadar ingin menyapa? Kirim pesan!" />

        <div className="contact-grid">
          <div className="contact-info reveal">
            <h3>Mari berkolaborasi ✨</h3>
            <p className="muted">
              Saya biasanya membalas dalam 1–2 hari kerja. Kamu juga bisa menghubungi saya lewat email atau media sosial di bawah.
            </p>
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="contact-line">
                <MailIcon /> {profile.email}
              </a>
            )}
            <div className="socials">
              {profile.socials?.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} title={s.name}>
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          <form className="card contact-form reveal" onSubmit={onSubmit} noValidate={false}>
            <div className="field">
              <label htmlFor="name">Nama</label>
              <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Nama kamu" required maxLength={100} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="kamu@email.com" required />
            </div>
            <div className="field">
              <label htmlFor="message">Pesan</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={onChange}
                placeholder="Tulis pesanmu di sini..."
                required
                minLength={10}
                maxLength={2000}
              />
            </div>

            {/* Honeypot anti-spam: disembunyikan dari manusia */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={onChange}
              className="hp-field"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <button type="submit" className="btn btn-primary btn-block" disabled={status.type === 'loading'}>
              {status.type === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}
            </button>

            {status.text && (
              <p className={`form-status ${status.type}`} role="status">
                {status.type === 'success' ? '✅ ' : '⚠️ '}
                {status.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
