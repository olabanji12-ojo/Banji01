import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProjectCardFanOut.css';

gsap.registerPlugin(ScrollTrigger);

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  overview: string;
  highlights: string[];
  stacks: string[];
  images: string[];
  link: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'tailor-voice',
    title: "Tailor's Voice",
    subtitle: 'AI Voice-Powered Measurement & Client Fitting System',
    category: 'Full-Stack Architecture',
    overview:
      "An AI-powered bespoke tailoring measurement system engineered with voice recognition via OpenAI Whisper. Tailors speak measurements hands-free while measuring clients, automatically parsing and formatting speech into structured client fitting profiles, garment specifications, and measurement histories.",
    highlights: [
      'Hands-free speech-to-measurement parsing via OpenAI Whisper integration',
      'High-throughput Go backend built with Gorilla Mux router and Redis caching',
      'Client measurement histories, style lookbooks, and offline-capable fitting records',
    ],
    stacks: ['Golang', 'React', 'Whisper AI', 'Redis', 'Gorilla Mux', 'Tailwind CSS'],
    images: ['/project-screenshot/Tilor-voice.png'],
    link: 'https://tailor-measurement.vercel.app/',
  },
  {
    id: 'queueless',
    title: 'Queueless Car Wash',
    subtitle: 'Automated Booking & Live Queue Management ("Uber for Car Washes")',
    category: 'Web Application',
    overview:
      "The 'Uber for car washes' — an on-demand booking and live queue management platform connecting vehicle owners with nearby car wash facilities. Users search stations on an interactive Mapbox interface, view real-time queue lengths, and reserve slots ahead of time to eliminate waiting in line.",
    highlights: [
      'Mapbox geocoding & reverse geocoding for proximity-based station discovery',
      'Live queue state and instant slot reservations managed via Redis',
      'Robust Go REST backend with MongoDB for persistent booking records and status tracking',
    ],
    stacks: ['Golang', 'React', 'MongoDB', 'Redis', 'Mapbox', 'Gorilla Mux'],
    images: ['/project-screenshot/carwash1.png', '/project-screenshot/carwash123.png'],
    link: 'https://www.queueless.online/',
  },
  {
    id: 'bomffa',
    title: 'Bomffa Store',
    subtitle: 'Bespoke E-Commerce Storefront ("Every Bag Tells A Story")',
    category: 'E-Commerce Storefront',
    overview:
      "Bespoke e-commerce storefront with curated bag collections, shopping cart state, dynamic catalog filtering, and direct Paystack payment gateway checkout integration.",
    highlights: [
      'Paystack payment gateway integration for secure, verified customer checkout',
      'Real-time product inventory and persistent order processing with Firebase',
      'Dynamic multi-category filtering, shopping bag state, and responsive showcase',
    ],
    stacks: ['React', 'JavaScript', 'Firebase', 'Paystack', 'CSS'],
    images: ['/project-screenshot/bomffa1.png', '/project-screenshot/Bomffa2.png'],
    link: 'http://bomffa.store/',
  },
  {
    id: 'goodthings',
    title: 'Good Things Co.',
    subtitle: 'Curated Creative Brand Catalog & Lifestyle Store',
    category: 'Brand Experience',
    overview:
      "Curated creative lifestyle brand store and boutique gift catalog with integrated Flutterwave payment gateway for smooth, reliable multi-currency checkout.",
    highlights: [
      'Flutterwave payment processing supporting local and cross-border payment options',
      'Tailored lifestyle product showcase with persistent shopping cart and wishlist',
      'Firebase backend ensuring real-time stock updates and checkout confirmations',
    ],
    stacks: ['React', 'TypeScript', 'Firebase', 'Flutterwave', 'Tailwind CSS'],
    images: ['/project-screenshot/goodthings1.png'],
    link: 'https://goodthingsco.vercel.app/',
  },
  {
    id: 'birthday',
    title: 'Solomon70 Celebration',
    subtitle: 'Interactive Milestone RSVP & Digital Guestbook Platform',
    category: 'Motion Web Experience',
    overview:
      "An interactive event platform engineered for a milestone 70th birthday celebration, featuring instant guest RSVP reservations, seat bookings, and a live digital wishes guestbook.",
    highlights: [
      'Interactive seat reservation workflow with instant guest attendance confirmation',
      'Live digital wishes guestbook powered by Firebase for real-time tributes',
      'Celebratory micro-interactions and smooth responsive motion pacing',
    ],
    stacks: ['React', 'TypeScript', 'Firebase', 'CSS Motion'],
    images: ['/project-screenshot/birthday12.png', '/project-screenshot/birthday123.png'],
    link: 'https://solomon70-theta.vercel.app/',
  },
  {
    id: 'study-track',
    title: 'Frontend Study Track',
    subtitle: 'Student Progress Dashboard & Milestone Analytics',
    category: 'EdTech Platform',
    overview:
      "Comprehensive student and educator progress tracking dashboard with milestone analytics, syllabus progression, performance metrics, and assignment tracking.",
    highlights: [
      'Visual learning velocity charts and assignment milestone tracking',
      'High-performance Go backend service with MongoDB for persistent student analytics',
      'Responsive student portal built with React and TypeScript for assessment feedback',
    ],
    stacks: ['Golang', 'React', 'TypeScript', 'MongoDB'],
    images: ['/project-screenshot/Study-track.png'],
    link: 'https://frontend-study-track.vercel.app/',
  },
];

// Matrix Vectors
const MATRIX_VECTORS = [
  { x: -380, y: -280, rot: -8, scale: 0.88 }, // 1,1
  { x: 0, y: -360, rot: 0, scale: 0.9 },      // 1,2
  { x: 380, y: -280, rot: 8, scale: 0.88 },   // 1,3
  { x: -380, y: 280, rot: 8, scale: 0.88 },   // 2,1
  { x: 0, y: 360, rot: 0, scale: 0.9 },       // 2,2
  { x: 380, y: 280, rot: -8, scale: 0.88 },   // 2,3
];

interface ProjectCardFanOutProps {
  headline?: string;
}

export default function ProjectCardFanOut({
  headline = 'Featured Projects & Systems',
}: ProjectCardFanOutProps) {
  const pinWrapperRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // State to track active screenshot image index for each card
  const [activeImageIndices, setActiveImageIndices] = useState<{ [key: string]: number }>({
    'tailor-voice': 0,
    queueless: 0,
    bomffa: 0,
    goodthings: 0,
    birthday: 0,
    'study-track': 0,
  });

  // Active Case Study Modal State
  const [activeCaseStudy, setActiveCaseStudy] = useState<ProjectItem | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Typewriter Animation State
  const [displayText, setDisplayText] = useState('');
  const [hasStartedTypewriter, setHasStartedTypewriter] = useState(false);
  const [isTypewriterComplete, setIsTypewriterComplete] = useState(false);

  // Trigger typewriter when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedTypewriter) {
          setHasStartedTypewriter(true);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (pinWrapperRef.current) {
      observer.observe(pinWrapperRef.current);
    }

    return () => observer.disconnect();
  }, [hasStartedTypewriter]);

  // Character-by-character typing loop
  useEffect(() => {
    if (!hasStartedTypewriter) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < headline.length) {
        setDisplayText(headline.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTypewriterComplete(true);
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [hasStartedTypewriter, headline]);

  // Matrix Vectors -> 2x3 Grid GSAP Choreography (Natural Fluid Scroll)
  useEffect(() => {
    if (!pinWrapperRef.current || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      const mult = isMobile ? 0.6 : 1;

      // 1. Initial State: Screen starts blank, cards placed on matrix vectors with opacity 0
      cardElementsRef.current.forEach((card, i) => {
        if (!card) return;
        const vec = MATRIX_VECTORS[i] || MATRIX_VECTORS[0];

        gsap.set(card, {
          x: vec.x * mult,
          y: vec.y * mult,
          rotation: vec.rot * mult,
          scale: vec.scale,
          opacity: 0,
          pointerEvents: 'none',
        });
      });

      // 2. Natural Fluid Scroll: Smoothly converges into 2x3 grid as you scroll without pinning
      gsap.to(cardElementsRef.current, {
        scrollTrigger: {
          trigger: pinWrapperRef.current,
          start: 'top 82%',
          end: 'top 28%',
          scrub: 1.2,
        },
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        pointerEvents: 'auto',
        ease: 'power3.out',
        stagger: 0.04,
      });
    }, pinWrapperRef);

    return () => ctx.revert();
  }, []);

  // Cycle image on mini-carousel
  const handlePrevImage = (e: React.MouseEvent, projectId: string, total: number) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndices((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] - 1 + total) % total,
    }));
  };

  const handleNextImage = (e: React.MouseEvent, projectId: string, total: number) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndices((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] + 1) % total,
    }));
  };

  const handleDotClick = (e: React.MouseEvent, projectId: string, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndices((prev) => ({
      ...prev,
      [projectId]: index,
    }));
  };

  // Open Case Study Modal
  const openCaseStudy = (project: ProjectItem) => {
    setActiveCaseStudy(project);
    setModalImageIndex(activeImageIndices[project.id] || 0);
  };

  const closeCaseStudy = () => {
    setActiveCaseStudy(null);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCaseStudy();
    };
    if (activeCaseStudy) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCaseStudy]);

  return (
    <section ref={pinWrapperRef} className="project-matrix-pin-wrapper">
      <div className="project-matrix-stage">
        {/* 1. Centered Typewriter Headline */}
        <div className="matrix-typewriter-header">
          <h2 className="typewriter-heading">
            <span>{displayText}</span>
            <span
              className={`typewriter-cursor ${
                isTypewriterComplete ? 'blinking' : 'typing'
              }`}
            >
              _
            </span>
          </h2>
          <p className="matrix-subtitle">Selected Web Applications &amp; Scalable Client Platforms</p>
        </div>

        {/* 2. 2x3 Project Grid Stage */}
        <div ref={gridRef} className="project-2x3-matrix-grid">
          {PROJECTS.map((project, index) => {
            const currentImgIndex = activeImageIndices[project.id] || 0;
            const hasMultipleImages = project.images.length > 1;

            return (
              <div
                key={project.id}
                ref={(el) => {
                  cardElementsRef.current[index] = el;
                }}
                className="matrix-project-card"
                onClick={() => openCaseStudy(project)}
              >
                {/* Visual Media with In-Card Mini Carousel */}
                <div className="card-media-viewport">
                  {/* Current Active Screenshot */}
                  <img
                    src={project.images[currentImgIndex]}
                    alt={`${project.title} screenshot ${currentImgIndex + 1}`}
                    className="card-media-img"
                    loading="lazy"
                  />

                  {/* Multi-Image Hover Carousel Controls */}
                  {hasMultipleImages && (
                    <div className="in-card-carousel-controls">
                      <button
                        type="button"
                        className="carousel-arrow prev"
                        aria-label="Previous screenshot"
                        onClick={(e) => handlePrevImage(e, project.id, project.images.length)}
                      >
                        ‹
                      </button>

                      <div className="carousel-dots-pill">
                        {project.images.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            className={`carousel-dot ${dotIdx === currentImgIndex ? 'active' : ''}`}
                            aria-label={`View image ${dotIdx + 1}`}
                            onClick={(e) => handleDotClick(e, project.id, dotIdx)}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        className="carousel-arrow next"
                        aria-label="Next screenshot"
                        onClick={(e) => handleNextImage(e, project.id, project.images.length)}
                      >
                        ›
                      </button>
                    </div>
                  )}

                  {/* Category Chip */}
                  <span className="card-category-tag">{project.category}</span>

                  {/* Case Study Click Hint on Hover */}
                  <div className="card-case-study-hint">
                    <span>Click for Full Architecture Details ↗</span>
                  </div>
                </div>

                {/* Card Meta Content: Title, Stacks & Action Link */}
                <div className="card-meta-content">
                  <div className="card-header-row">
                    <h3 className="card-project-title">{project.title}</h3>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-external-link"
                      title="Open Live Preview"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Live</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                  </div>

                  <p className="card-project-desc">{project.subtitle}</p>

                  {/* Tech Stack Badges */}
                  <div className="card-tech-badges">
                    {project.stacks.map((tech) => (
                      <span key={tech} className="tech-badge-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Case Study & Architecture Modal */}
      {activeCaseStudy && (
        <div className="case-study-modal-backdrop" onClick={closeCaseStudy}>
          <div className="case-study-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="case-study-close-btn"
              onClick={closeCaseStudy}
              aria-label="Close Case Study"
            >
              ✕
            </button>

            {/* Modal Image Frame */}
            <div className="case-study-media-stage">
              <img
                src={activeCaseStudy.images[modalImageIndex]}
                alt={`${activeCaseStudy.title} Preview`}
                className="case-study-modal-img"
              />

              {activeCaseStudy.images.length > 1 && (
                <div className="modal-image-switcher">
                  {activeCaseStudy.images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`modal-switcher-btn ${idx === modalImageIndex ? 'active' : ''}`}
                      onClick={() => setModalImageIndex(idx)}
                    >
                      View Screenshot {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="case-study-body">
              <div className="modal-header-line">
                <div>
                  <span className="modal-category-chip">{activeCaseStudy.category}</span>
                  <h3 className="modal-project-title">{activeCaseStudy.title}</h3>
                </div>

                <a
                  href={activeCaseStudy.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-live-btn"
                >
                  <span>Launch Live Site</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>

              {/* Natural Explanation / Overview */}
              <div className="modal-section-block">
                <h4 className="modal-section-title">What It Does &amp; Core Workflow</h4>
                <p className="modal-overview-text">{activeCaseStudy.overview}</p>
              </div>

              {/* Architectural Highlights */}
              <div className="modal-section-block">
                <h4 className="modal-section-title">Key Architectural Highlights</h4>
                <ul className="modal-highlights-list">
                  {activeCaseStudy.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              {/* Real Tech Stacks */}
              <div className="modal-section-block">
                <h4 className="modal-section-title">Verified Production Stack</h4>
                <div className="modal-tech-pills">
                  {activeCaseStudy.stacks.map((st) => (
                    <span key={st} className="modal-tech-pill">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
