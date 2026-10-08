import { useReveal } from '../useReveal'
import { PinIcon, MailIcon } from './Icons'

export default function About({ profile }) {
  const ref = useReveal()

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <SectionTitle eyebrow="01" title="Tentang Saya" />

        <div className="about-grid">
          <div className="about-text reveal">
            {profile.about?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <ul className="about-meta">
              {profile.location && (
                <li>
                  <PinIcon size={18} /> {profile.location}
                </li>
              )}
              {profile.email && (
                <li>
                  <MailIcon size={18} /> <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </li>
              )}
            </ul>
          </div>

          <div className="stats">
            {profile.stats?.map((s, i) => (
              <div key={s.label} className="stat-card reveal" style={{ '--d': `${i * 100}ms` }}>
                <span className="stat-value gradient-text">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="section-title reveal">
      <span className="eyebrow mono">{eyebrow}.</span>
      <h2>{title}</h2>
      {subtitle && <p className="muted">{subtitle}</p>}
      <span className="title-line" />
    </div>
  )
}
