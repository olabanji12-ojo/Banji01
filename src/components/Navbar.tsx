import React, { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`portfolio-navbar-wrapper ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="portfolio-navbar">
        {/* Brand / Logo on the left */}
        <a href="#hero" className="navbar-brand" onClick={(e) => scrollToSection(e, 'hero')}>
          <span className="brand-dot" />
          <span className="brand-name">OLABANJI OJO</span>
        </a>

        {/* Navigation Links in Center */}
        <div className="navbar-nav-links">
          <a
            href="#what-i-do"
            className="nav-link"
            onClick={(e) => scrollToSection(e, 'what-i-do')}
          >
            What I Do
          </a>
          <a
            href="#projects"
            className="nav-link"
            onClick={(e) => scrollToSection(e, 'projects')}
          >
            Projects
          </a>
          <a
            href="#motion-videos"
            className="nav-link"
            onClick={(e) => scrollToSection(e, 'motion-videos')}
          >
            Videos
          </a>
          <a
            href="#about"
            className="nav-link"
            onClick={(e) => scrollToSection(e, 'about')}
          >
            About
          </a>
          <a
            href="#contact"
            className="nav-link"
            onClick={(e) => scrollToSection(e, 'contact')}
          >
            Contact
          </a>
        </div>

        {/* CTA Button on the right */}
        <div className="navbar-actions">
          <a
            href="#contact"
            className="navbar-cta-btn"
            onClick={(e) => scrollToSection(e, 'contact')}
          >
            <span>Let's Talk</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}

