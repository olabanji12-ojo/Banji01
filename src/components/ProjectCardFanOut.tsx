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
  stacks: string[];
  images: string[];
  link: string;
  // Matrix position: (row, col)
  matrixPos: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'tailor-voice',
    title: "Tailor's Voice",
    subtitle: 'Bespoke Measurement & Client Fitting System',
    category: 'Full-Stack Architecture',
    stacks: ['React', 'TypeScript', 'Tailwind'],
    images: ['/project-screenshot/Tilor-voice.png'],
    link: 'https://tailor-measurement.vercel.app/',
    matrixPos: '(1,1) Top-Left',
  },
  {
    id: 'queueless',
    title: 'Queueless Car Wash',
    subtitle: 'Automated Booking & Live Queue Management',
    category: 'Web Application',
    stacks: ['Python', 'Django', 'React'],
    images: ['/project-screenshot/carwash1.png', '/project-screenshot/carwash123.png'],
    link: 'https://www.queueless.online/',
    matrixPos: '(1,2) Top-Center',
  },
  {
    id: 'bomffa',
    title: 'Bomffa Store',
    subtitle: 'Editorial E-Commerce Platform ("Every Bag Tells A Story")',
    category: 'E-Commerce Storefront',
    stacks: ['React', 'TypeScript', 'Tailwind'],
    images: ['/project-screenshot/bomffa1.png', '/project-screenshot/Bomffa2.png'],
    link: 'http://bomffa.store/',
    matrixPos: '(1,3) Top-Right',
  },
  {
    id: 'goodthings',
    title: 'Good Things Co.',
    subtitle: 'Curated Creative Brand Catalog & Shop',
    category: 'Brand Experience',
    stacks: ['React', 'Next.js', 'Tailwind'],
    images: ['/project-screenshot/goodthings1.png'],
    link: 'https://goodthingsco.vercel.app/',
    matrixPos: '(2,1) Bottom-Left',
  },
  {
    id: 'birthday',
    title: 'Solomon70 Celebration',
    subtitle: 'Interactive Milestone & Wishes Platform',
    category: 'Motion Web Experience',
    stacks: ['React', 'GSAP', 'CSS Motion'],
    images: ['/project-screenshot/birthday12.png', '/project-screenshot/birthday123.png'],
    link: 'https://solomon70-theta.vercel.app/',
    matrixPos: '(2,2) Bottom-Center',
  },
  {
    id: 'study-track',
    title: 'Frontend Study Track',
    subtitle: 'Student Progress Dashboard & Milestone Analytics',
    category: 'EdTech Platform',
    stacks: ['React', 'TypeScript', 'Prisma'],
    images: ['/project-screenshot/Study-track.png'],
    link: 'https://frontend-study-track.vercel.app/',
    matrixPos: '(2,3) Bottom-Right',
  },
];

// Exact Directional Matrix Vectors:
// (1,1) Top-Left Diagonal
// (1,2) Top-Center Vertical (from top)
// (1,3) Top-Right Diagonal
// (2,1) Bottom-Left Diagonal
// (2,2) Bottom-Center Vertical (from bottom)
// (2,3) Bottom-Right Diagonal
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

  // Matrix Vectors -> 2x3 Grid GSAP Choreography (Natural Fluid Scroll - No Screen Lock)
  useEffect(() => {
    if (!pinWrapperRef.current || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      const mult = isMobile ? 0.6 : 1;

      // 1. Initial State: Screen starts blank, cards are placed on their matrix vectors with opacity 0
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
          <p className="matrix-subtitle">Selected Web Applications & Scalable Client Platforms</p>
        </div>

        {/* 2. 2x3 Project Grid Stage (Blank initially, then cards fly into their slots) */}
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

                      {/* Pagination Dots */}
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
    </section>
  );
}
