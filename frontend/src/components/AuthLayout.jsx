import { Link } from 'react-router-dom';
import '../styles/auth.css';

const BLOBS = [
  { className: 'auth-blob auth-blob--1' },
  { className: 'auth-blob auth-blob--2' },
  { className: 'auth-blob auth-blob--3' },
  { className: 'auth-blob auth-blob--4' },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => i);

export default function AuthLayout({
  variant = 'login',
  title,
  subtitle,
  icon,
  children,
  footer,
}) {
  return (
    <div className={`auth-page auth-page--${variant}`}>
      <div className="auth-bg" aria-hidden="true">
        <div className="auth-gradient" />
        <div className="auth-grid" />
        {BLOBS.map((blob) => (
          <div key={blob.className} className={blob.className} />
        ))}
        <div className="auth-particles">
          {PARTICLES.map((i) => (
            <span
              key={i}
              className="auth-particle"
              style={{
                left: `${(i * 17 + 7) % 100}%`,
                top: `${(i * 23 + 11) % 100}%`,
                animationDelay: `${-(i * 0.35)}s`,
              }}
            />
          ))}
        </div>
        <div className="auth-shine" />
      </div>

      <div className="auth-content">
        <div className="auth-brand">
          <Link to="/login" className="auth-brand-link">
            <span className="auth-brand-icon" aria-hidden="true">
              {icon || '★'}
            </span>
            <span>Store Rating</span>
          </Link>
        </div>

        <div className="auth-card-wrap">
          <article className="auth-card">
            <header className="auth-card-header">
              <h1 className="auth-title">{title}</h1>
              {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            </header>
            <div className="auth-card-body">{children}</div>
          </article>
        </div>

        {footer && <footer className="auth-footer">{footer}</footer>}
      </div>
    </div>
  );
}
