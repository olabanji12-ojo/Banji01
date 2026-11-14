import React, { useEffect, useRef, useState } from 'react';
import './WhatIDoSection.css';

// Crisp, high-fidelity SVGs for each technology logo
const TechIcons: Record<string, React.ReactNode> = {
  Go: (
    <svg viewBox="0 0 28 24" width="22" height="18" fill="none">
      {/* Official Go Brand Logo (golang.org) */}
      <path
        d="M1.5 8.5h4.2a.5.5 0 0 1 .5.5v.6a.5.5 0 0 1-.5.5H1.5a.5.5 0 0 1-.5-.5V9a.5.5 0 0 1 .5-.5zm1.8 2.6h2.5a.5.5 0 0 1 .5.5v.6a.5.5 0 0 1-.5.5H3.3a.5.5 0 0 1-.5-.5v-.6a.5.5 0 0 1 .5-.5zm-3 2.6h5.4a.5.5 0 0 1 .5.5v.6a.5.5 0 0 1-.5.5H.3a.5.5 0 0 1-.5-.5v-.6a.5.5 0 0 1 .5-.5z"
        fill="#00ADD8"
      />
      <path
        d="M15.4 10.8c-.3-.5-.7-.9-1.3-1.1-.6-.3-1.2-.4-1.9-.4-.9 0-1.7.2-2.3.7-.7.5-1.2 1.1-1.6 1.8-.4.8-.6 1.7-.6 2.6 0 1 .2 1.9.6 2.7.4.8 1 1.4 1.7 1.8.8.4 1.6.7 2.6.7.7 0 1.4-.1 2-.4.6-.3 1-.7 1.4-1.2.4-.5.6-1.1.6-1.9h-4.3v-1.7h6.1c0 .6-.1 1.2-.2 1.8a5.7 5.7 0 0 1-.9 2c-.5.7-1.1 1.2-1.9 1.5-.8.4-1.8.6-2.9.6-1.3 0-2.5-.3-3.6-.9-1-.6-1.8-1.5-2.4-2.6-.6-1.1-.9-2.4-.9-3.9 0-1.5.3-2.8.9-3.9 1-2 2.7-3 5.1-3 1.1 0 2.1.2 3 .6.8.4 1.5 1 2 1.8l-1.6 1.4z"
        fill="#00ADD8"
      />
      <path
        d="M21.2 9.3c1 0 1.8.2 2.5.7.7.4 1.2 1.1 1.6 1.8.4.8.6 1.7.6 2.6 0 1-.2 1.9-.6 2.7-.4.8-1 1.4-1.7 1.8-.8.5-1.7.7-2.7.7-1 0-1.9-.2-2.6-.7-.8-.4-1.3-1-1.7-1.8-.4-.8-.6-1.7-.6-2.7 0-1 .2-1.8.6-2.6.4-.8 1-1.4 1.7-1.8.7-.5 1.6-.7 2.7-.7zm0 1.8c-.5 0-1 .1-1.3.4-.4.3-.7.7-.9 1.2-.2.5-.3 1.1-.3 1.8 0 .7.1 1.3.3 1.8.2.5.5.9.9 1.2.4.3.8.4 1.3.4.5 0 1-.1 1.4-.4.4-.3.7-.7.9-1.2.2-.5.3-1.1.3-1.8 0-.7-.1-1.3-.3-1.8-.2-.5-.5-.9-.9-1.2-.4-.3-.9-.4-1.4-.4z"
        fill="#00ADD8"
      />
    </svg>
  ),
  Python: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M11.9 2c-3.1 0-5 1.4-5 3.3v2.2h5.2v.7H4.3C2.3 8.2 1 10 1 12.5c0 2.6 1.4 4.3 3.3 4.3h1.8v-2.1c0-2 1.7-3.7 3.7-3.7h5.2V8.8c0-3.1-2-4.8-5.1-4.8H11.9zm-2.4 2a.9.9 0 110 1.8.9.9 0 010-1.8z"
        fill="#3776AB"
      />
      <path
        d="M12.1 22c3.1 0 5-1.4 5-3.3v-2.2h-5.2v-.7h7.8c2 0 3.3-1.8 3.3-4.3 0-2.6-1.4-4.3-3.3-4.3h-1.8v2.1c0 2-1.7 3.7-3.7 3.7H9v2.2c0 3.1 2 4.8 5.1 4.8h-2zm2.4-2a.9.9 0 110-1.8.9.9 0 010 1.8z"
        fill="#FFD43B"
      />
    </svg>
  ),
  Django: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect width="24" height="24" rx="5" fill="#092E20" />
      <text
        x="5"
        y="17"
        fill="#44B78B"
        fontFamily="system-ui, sans-serif"
        fontSize="13"
        fontWeight="900"
        letterSpacing="-0.5"
      >
        dj
      </text>
    </svg>
  ),
  React: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        stroke="#61DAFB"
        strokeWidth="1.5"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        stroke="#61DAFB"
        strokeWidth="1.5"
        transform="rotate(120 12 12)"
      />
      <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
    </svg>
  ),
  TypeScript: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect width="24" height="24" rx="5" fill="#3178C6" />
      <text
        x="4"
        y="17"
        fill="#ffffff"
        fontFamily="system-ui, sans-serif"
        fontSize="12"
        fontWeight="800"
      >
        TS
      </text>
    </svg>
  ),
  MongoDB: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 2C12 2 6 9 6 15c0 3.3 2.7 6 6 6s6-2.7 6-6c0-6-6-13-6-13z"
        fill="#13AA52"
      />
      <path d="M12 2v19c-.3 0-.6-.1-.9-.3C8.6 19.3 7 17.3 7 15c0-4.5 5-13 5-13z" fill="#00ED64" />
      <path d="M11.5 21.8c.2.1.3.2.5.2v-7.5l-.5 7.3z" fill="#ffffff" opacity="0.3" />
    </svg>
  ),
  Docker: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M22.5 10.5c-.3-.2-1.5-.3-2.3.2-.2-.7-.7-1.4-1.5-1.8l-.5-.3-.3.5c-.5.8-.4 1.8-.1 2.5-.6.3-1.6.4-2.5.4H2.4c-.2 1.3.1 3.5 1.5 5.2C5.6 19 8.7 20 13 20c6.4 0 9.8-3.6 10.4-8.2.1-.6.1-.9-.9-1.3z"
        fill="#2496ED"
      />
      <rect x="7" y="11" width="2" height="1.8" rx=".3" fill="#ffffff" />
      <rect x="9.5" y="11" width="2" height="1.8" rx=".3" fill="#ffffff" />
      <rect x="12" y="11" width="2" height="1.8" rx=".3" fill="#ffffff" />
      <rect x="9.5" y="8.8" width="2" height="1.8" rx=".3" fill="#ffffff" />
      <rect x="12" y="8.8" width="2" height="1.8" rx=".3" fill="#ffffff" />
    </svg>
  ),
  Remotion: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <defs>
        <linearGradient id="remotionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B84F3" />
          <stop offset="50%" stopColor="#E03177" />
          <stop offset="100%" stopColor="#00D8F6" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#remotionGrad)" />
      <polygon points="10,8 17,12 10,16" fill="#ffffff" />
    </svg>
  ),
  Hyperframes: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="#A855F7" strokeWidth="2" />
      <path d="M8 8l8 8M16 8l-8 8" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Codex: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect width="24" height="24" rx="5" fill="#18181b" stroke="#38bdf8" strokeWidth="1.2" />
      <path d="M7 8l4 4-4 4M13 16h4" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Antigravity: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#a855f7" strokeWidth="1.2" fill="#18181b" />
      <path d="M12 6v12M8 10l4-4 4 4" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  PremierePro: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect width="24" height="24" rx="5" fill="#00005B" stroke="#EA77FF" strokeWidth="1.2" />
      <text
        x="4.5"
        y="17"
        fill="#EA77FF"
        fontFamily="system-ui, sans-serif"
        fontSize="12"
        fontWeight="800"
      >
        Pr
      </text>
    </svg>
  ),
  ThreeJS: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <polygon points="12,2 22,19 2,19" stroke="#ffffff" strokeWidth="1.8" fill="none" />
      <polygon points="12,7 18,17 6,17" fill="#ffffff" opacity="0.8" />
    </svg>
  ),
  AIVideo: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 2l2.4 5.6L20 10l-4.4 4 1.2 5.8-4.8-3.2-4.8 3.2 1.2-5.8L4 10l5.6-2.4L12 2z"
        fill="#F59E0B"
      />
    </svg>
  ),
};

export default function WhatIDoSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const headline = 'I build custom websites, web applications, and videos that stand out.';
  const words = headline.split(' ');

  const devStack = [
    { name: 'Go', icon: TechIcons.Go },
    { name: 'Python', icon: TechIcons.Python },
    { name: 'Django', icon: TechIcons.Django },
    { name: 'React', icon: TechIcons.React },
    { name: 'TypeScript', icon: TechIcons.TypeScript },
    { name: 'MongoDB', icon: TechIcons.MongoDB },
    { name: 'Docker', icon: TechIcons.Docker },
  ];

  const motionStack = [
    { name: 'Remotion', icon: TechIcons.Remotion },
    { name: 'Hyperframes', icon: TechIcons.Hyperframes },
    { name: 'Codex', icon: TechIcons.Codex },
    { name: 'Antigravity', icon: TechIcons.Antigravity },
    { name: 'Three.js', icon: TechIcons.ThreeJS },
    { name: 'AI Video', icon: TechIcons.AIVideo },
  ];

  return (
    <section
      ref={sectionRef}
      className={`what-i-do-section ${isVisible ? 'in-view' : ''}`}
    >
      <div className="wid-inner">

        {/* 1. Centered Word-by-Word Headline */}
        <div className="wid-headline-wrapper">
          <h2 className="wid-headline">
            {words.map((word, index) => (
              <span key={index} className="word-wrapper">
                <span
                  className="word-inner"
                  style={{
                    transitionDelay: `${index * 0.075 + 0.05}s`,
                  }}
                >
                  {word}
                </span>
                <span className="word-space">&nbsp;</span>
              </span>
            ))}
          </h2>
        </div>

        {/* 2. Floating Obsidian Black Cards Grid */}
        <div className="wid-obsidian-grid">

          {/* CARD 1: Software Engineer */}
          <div className="obsidian-card card-dev">
            {/* Top Indicator */}
            <div className="card-top-tag">
              <span className="pulse-indicator green-pulse"></span>
              <span className="tag-label">[ 01 // ARCHITECTURE ]</span>
            </div>

            {/* Card Content */}
            <div className="card-body">
              <h3 className="card-title">Software Engineer</h3>
              <p className="card-desc">
                Building fast, reliable web applications and scalable Go & Python backends.
              </p>
            </div>

            {/* Interactive Animated Tech Pills */}
            <div className="stack-pills-row">
              {devStack.map((tech, i) => (
                <div
                  key={i}
                  className="obsidian-pill"
                  style={{
                    transitionDelay: `${0.35 + i * 0.055}s`,
                  }}
                >
                  <span className="pill-icon">{tech.icon}</span>
                  <span className="pill-name">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 2: Video & Motion Designer */}
          <div className="obsidian-card card-motion">
            {/* Top Indicator */}
            <div className="card-top-tag">
              <span className="pulse-indicator amber-pulse"></span>
              <span className="tag-label">[ 02 // CREATIVE ENGINE ]</span>
            </div>

            {/* Card Content */}
            <div className="card-body">
              <h3 className="card-title">Video & Motion Designer</h3>
              <p className="card-desc">
                Creating code-driven product videos, UI animations, and motion reels with Remotion and Hyperframes.
              </p>
            </div>

            {/* Interactive Animated Creative Pills */}
            <div className="stack-pills-row">
              {motionStack.map((tool, i) => (
                <div
                  key={i}
                  className="obsidian-pill"
                  style={{
                    transitionDelay: `${0.45 + i * 0.055}s`,
                  }}
                >
                  <span className="pill-icon">{tool.icon}</span>
                  <span className="pill-name">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
