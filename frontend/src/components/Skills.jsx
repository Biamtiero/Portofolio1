import { useReveal } from '../useReveal'
import { SectionTitle } from './About'

export default function Skills({ skills }) {
  const ref = useReveal()

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <SectionTitle eyebrow="02" title="Skills & Tech Stack" subtitle="Teknologi yang biasa saya gunakan untuk membangun produk." />

        <div className="skills-grid">
          {skills.map((group, i) => (
            <div key={group.category} className="card skill-card reveal" style={{ '--d': `${i * 120}ms` }}>
              <h3>{group.category}</h3>
              <div className="chips">
                {group.items.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
