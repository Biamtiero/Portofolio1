export default function Footer({ profile }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {profile.name}. Dibuat dengan <span className="gradient-text">React</span> &{' '}
          <span className="gradient-text">Go</span>.
        </p>
        <a href="#home" className="back-top">
          Kembali ke atas ↑
        </a>
      </div>
    </footer>
  )
}
