import { useEffect, useState } from 'react'
import { SocialIcon } from './Icons'

export default function Hero({ profile }) {
  const typed = useTypewriter(profile.role)

  return (
    <section id="home" className="hero">
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-text">
          {profile.available && (
            <span className="badge fade-up" style={{ '--d': '0ms' }}>
              <span className="pulse-dot" /> Terbuka untuk peluang baru
            </span>
          )}
          <p className="hero-hello fade-up" style={{ '--d': '100ms' }}>
            Halo, saya
          </p>
          <h1 className="hero-name fade-up" style={{ '--d': '200ms' }}>
            <span className="gradient-text">{profile.name}</span>
          </h1>
          <h2 className="hero-role fade-up" style={{ '--d': '300ms' }}>
            <span className="mono">&gt;</span> {typed}
            <span className="caret" />
          </h2>
          <p className="hero-tagline fade-up" style={{ '--d': '400ms' }}>
            {profile.tagline}
          </p>

          <div className="hero-actions fade-up" style={{ '--d': '500ms' }}>
            <a href="#projects" className="btn btn-primary">
              Lihat Project
            </a>
            <a href="#contact" className="btn btn-ghost">
              Hubungi Saya
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} className="btn btn-ghost" target="_blank" rel="noreferrer">
                Download CV
              </a>
            )}
          </div>

          <div className="socials fade-up" style={{ '--d': '600ms' }}>
            {profile.socials?.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} title={s.name}>
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>
        </div>

        <div className="hero-visual fade-up" style={{ '--d': '300ms' }}>
          <div className="avatar-ring">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="avatar" />
            ) : (
              <div className="avatar avatar-placeholder">
                {profile.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>
          <div className="floating-card card-1">
            <span className="mono">{'</>'}</span> React
          </div>
          <div className="floating-card card-2">
            <span className="mono">go</span> Golang
          </div>
        </div>
      </div>

      <a href="#about" className="scroll-hint" aria-label="Scroll ke bawah">
        <span />
      </a>
    </section>
  )
}

// Efek mengetik untuk teks role.
function useTypewriter(text, speed = 70) {
  const [out, setOut] = useState('')
  useEffect(() => {
    let i = 0
    setOut('')
    const id = setInterval(() => {
      i++
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return out
}
