import { useEffect, useState } from 'react'
import { getPortfolio } from './api'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    setError('')
    getPortfolio()
      .then((res) => {
        setData(res)
        if (res.profile?.name) {
          document.title = `${res.profile.name} | ${res.profile.role}`
        }
      })
      .catch((err) => setError(err.message || 'Gagal terhubung ke server'))
  }

  useEffect(load, [])

  if (error) {
    return (
      <div className="state-screen">
        <div className="state-card">
          <div className="state-icon">⚠️</div>
          <h2>Tidak dapat memuat data</h2>
          <p>{error}</p>
          <p className="muted small">Pastikan backend Go sudah berjalan di port 8080.</p>
          <button className="btn btn-primary" onClick={load}>
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="state-screen">
        <div className="loader" aria-label="Memuat" />
      </div>
    )
  }

  const { profile, skills = [], projects = [], experience = [] } = data

  return (
    <>
      <div className="bg-grid" aria-hidden="true" />
      <Navbar name={profile.name} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience items={experience} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  )
}
