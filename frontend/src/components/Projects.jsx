import { useMemo, useState } from 'react'
import { useReveal } from '../useReveal'
import { SectionTitle } from './About'
import { SocialIcon, ExternalIcon } from './Icons'

export default function Projects({ projects }) {
  const ref = useReveal()
  const [filter, setFilter] = useState('Semua')

  // Filter otomatis dibuat dari daftar teknologi semua project.
  const filters = useMemo(() => {
    const all = new Set(projects.flatMap((p) => p.tech || []))
    return ['Semua', ...all]
  }, [projects])

  const shown = filter === 'Semua' ? projects : projects.filter((p) => p.tech?.includes(filter))

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <SectionTitle eyebrow="03" title="Project" subtitle="Beberapa hal yang pernah saya bangun." />

        <div className="filters reveal">
          {filters.map((f) => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {shown.map((p) => (
            <article key={p.title} className={`card project-card ${p.featured ? 'featured' : ''}`}>
              <div className="project-thumb">
                {p.image ? (
                  <img src={p.image} alt={p.title} loading="lazy" />
                ) : (
                  <div className="thumb-placeholder mono">{'{ ' + p.title.split(' ')[0] + ' }'}</div>
                )}
                {p.featured && <span className="featured-tag">★ Unggulan</span>}
              </div>
              <div className="project-body">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="chips small">
                  {p.tech?.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer">
                      <SocialIcon name="github" size={18} /> Kode
                    </a>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noreferrer">
                      <ExternalIcon /> Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
