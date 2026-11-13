import React, { useState } from 'react';
import './ContactSection.css';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = 'emmanuelojo291@gmail.com';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="contact-footer-section">
      <div className="contact-container">

        {/* Section Header */}
        <div className="contact-header">
          <span className="contact-badge">[ 05 // LET'S CONNECT ]</span>
          <h2 className="contact-headline">
            Have a project or vision in mind?<br />
            Let's build something exceptional.
          </h2>
          <p className="contact-subhead">
            Available for full-stack software systems, automated video pipelines, and bespoke client platforms.
          </p>
        </div>

        {/* Main Contact Card */}
        <div className="contact-card">
          <div className="contact-card-inner">
            <span className="contact-card-label">GET IN TOUCH DIRECTLY</span>
            <a href={`mailto:${email}`} className="contact-email-link">
              {email}
            </a>

            <div className="contact-action-row">
              <a
                href={`mailto:${email}`}
                className="contact-primary-btn"
              >
                <span>Send Message</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>

              <button
                type="button"
                className={`contact-copy-btn ${copied ? 'is-copied' : ''}`}
                onClick={handleCopyEmail}
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Copied! ✓</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Channels & Status Grid */}
        <div className="contact-channels-grid">
          {/* LinkedIn Link */}
          <a
            href="https://www.linkedin.com/in/olabanjiojo"
            target="_blank"
            rel="noopener noreferrer"
            className="channel-card"
          >
            <div className="channel-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </div>
            <div className="channel-info">
              <span className="channel-name">LinkedIn</span>
              <span className="channel-handle">/in/olabanjiojo</span>
            </div>
            <span className="channel-arrow">↗</span>
          </a>

          {/* GitHub Link */}
          <a
            href="https://github.com/olabanji12-ojo"
            target="_blank"
            rel="noopener noreferrer"
            className="channel-card"
          >
            <div className="channel-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </div>
            <div className="channel-info">
              <span className="channel-name">GitHub</span>
              <span className="channel-handle">olabanji12-ojo</span>
            </div>
            <span className="channel-arrow">↗</span>
          </a>

          {/* Availability Card */}
          <div className="channel-card status-card">
            <div className="channel-icon-wrap status-dot-wrap">
              <span className="live-status-dot" />
            </div>
            <div className="channel-info">
              <span className="channel-name">Availability</span>
              <span className="channel-handle status-text">Open for Contracts &amp; Full-Time</span>
            </div>
          </div>

          {/* Location Card */}
          <div className="channel-card location-card">
            <div className="channel-icon-wrap">
              <span>📍</span>
            </div>
            <div className="channel-info">
              <span className="channel-name">Location</span>
              <span className="channel-handle">Lagos, Nigeria • WAT (UTC+1)</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-brand-info">
            <span className="footer-brand-name">OLABANJI OJO</span>
            <span className="footer-copyright">
              © 2026 Olabanji Ojo. Built with Three.js, React, TypeScript &amp; GSAP.
            </span>
          </div>

          <button
            type="button"
            className="back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>

      </div>
    </footer>
  );
}

