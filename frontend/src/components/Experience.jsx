import { useReveal } from '../useReveal'
import { SectionTitle } from './About'

export default function Experience({ items }) {
  const ref = useReveal()

  return (
    <section id="experience" className="section" ref={ref}>
      <div className="container">
        <SectionTitle eyebrow="04" title="Pengalaman & Pendidikan" />

        <ol className="timeline">
          {items.map((item, i) => (
            <li key={`${item.title}-${i}`} className="timeline-item reveal" style={{ '--d': `${i * 100}ms` }}>
              <span className={`timeline-dot ${item.type}`}>{item.type === 'education' ? '🎓' : '💼'}</span>
              <div className="card timeline-card">
                <div className="timeline-head">
                  <h3>{item.title}</h3>
                  <span className="period mono">{item.period}</span>
                </div>
                <p className="org">{item.org}</p>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
