import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, BarChart3, PlusCircle, Bell, History, ArrowRight, Sparkles } from 'lucide-react';
import './LandingPage.css';

const features = [
  {
    icon: BarChart3,
    title: 'Interaktywny Pulpit',
    description: 'Śledzenie wydatków w czasie rzeczywistym z wykresami i statystykami – tygodniowo, miesięcznie, rocznie.',
    color: 'var(--primary)',
    bg: 'rgba(99, 102, 241, 0.15)',
  },
  {
    icon: PlusCircle,
    title: 'Szybkie Dodawanie',
    description: 'Dodaj wydatek w kilka sekund — wybierz kategorię, wpisz kwotę i zapisz. To naprawdę proste.',
    color: 'var(--success)',
    bg: 'rgba(16, 185, 129, 0.15)',
  },
  {
    icon: Bell,
    title: 'Przypomnienia',
    description: 'Nigdy nie zapomnij o OC, przeglądzie czy wymianie opon. Ustaw termin i bądź spokojny.',
    color: 'var(--warning)',
    bg: 'rgba(245, 158, 11, 0.15)',
  },
  {
    icon: History,
    title: 'Pełna Historia',
    description: 'Przeglądaj każdy wydatek, filtruj i sortuj. Pełna kontrola nad tym, na co idą Twoje pieniądze.',
    color: 'var(--info)',
    bg: 'rgba(59, 130, 246, 0.15)',
  },
];

const LandingPage = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return (
    <div className="landing">
      {/* ─── Navbar ─── */}
      <nav className={`landing-nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-brand">
          <Car size={28} />
          <span>CarFlow</span>
        </div>
        <div className="landing-nav-actions">
          <Link to="/login" className="btn-ghost">Zaloguj się</Link>
          <Link to="/signup" className="btn-cta">Utwórz konto</Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            Twoje auto, Twoje finanse
          </div>
          <h1>
            Kontroluj wydatki<br />
            z <span className="gradient-text">CarFlow</span>
          </h1>
          <p className="hero-description">
            Śledź koszty eksploatacji samochodu, ustawiaj przypomnienia o ważnych terminach 
            i analizuj swoje wydatki dzięki przejrzystym wykresom — wszystko w jednym miejscu.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-cta btn-cta-large">
              Zacznij za darmo
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-ghost">
              Mam już konto
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="features-section animate-on-scroll">
        <p className="section-label">Funkcje</p>
        <h2>Wszystko, czego potrzebujesz</h2>
        <p>Prosty, ale potężny zestaw narzędzi do zarządzania kosztami Twojego auta.</p>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card glass-panel animate-on-scroll"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="feature-icon" style={{ background: feature.bg, color: feature.color }}>
                <feature.icon size={26} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bottom-cta animate-on-scroll">
        <div className="bottom-cta-card glass-panel">
          <h2>Gotowy, by przejąć kontrolę?</h2>
          <p>
            Dołącz do CarFlow i zacznij świadomie zarządzać wydatkami na swoje auto. 
            Rejestracja zajmuje mniej niż minutę.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-cta btn-cta-large">
              Utwórz konto
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="landing-footer">
        © {new Date().getFullYear()} CarFlow. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default LandingPage;
