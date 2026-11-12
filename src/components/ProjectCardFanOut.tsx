import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProjectCardFanOut.css';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  tag: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  image: string;
  accent: string;
}

const PROJECTS: Project[] = [
  {
    id: '01',
    tag: '01 // SAAS & SYSTEMS',
    title: "Tailor's Voice",
    category: 'Full-Stack Platform (Go + React)',
    description: 'Bespoke fashion operating system automating client measurement tracking, SMS notifications, and digital invoices.',
    stack: ['Go', 'React', 'MongoDB', 'REST API'],
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    accent: '#10b981',
  },
  {
    id: '02',
    tag: '02 // VIDEO AUTOMATION',
    title: 'Programmatic Video Engine',
    category: 'Motion Engineering (Remotion)',
    description: 'Code-driven automated video generation pipelines rendering branded kinetic video sequences from structured JSON data.',
    stack: ['Remotion', 'TypeScript', 'Node.js', 'FFmpeg'],
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    accent: '#ec4899',
  },
  {
    id: '03',
    tag: '03 // CREATIVE 3D',
    title: 'Kinetic 3D Typography',
    category: 'WebGL & Three.js Lab',
    description: 'Experimental 3D vertical reel typography and physics-based scroll scrubbing recreating luxury motion graphics on the web.',
    stack: ['Three.js', 'React', 'CSS 3D', 'WebGL'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    accent: '#00ADD8',
  },
  {
    id: '04',
    tag: '04 // BACKEND & API',
    title: 'Distributed Core Service',
    category: 'High-Performance API (Python/Go)',
    description: 'Robust asynchronous microservice architecture handling authentication, caching, and database transactions under high concurrency.',
    stack: ['Python', 'Django', 'Docker', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    accent: '#f59e0b',
  },
  {
    id: '05',
    tag: '05 // MOTION & AI',
    title: 'Visual Storytelling Suite',
    category: 'AI Video & Direction',
    description: 'Blending AI generative pipelines with After Effects and Premiere Pro to produce viral, retention-first social motion campaigns.',
    stack: ['Hyperframes', 'After Effects', 'AI Video', 'Premiere'],
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    accent: '#8b5cf6',
  },
];

export default function ProjectCardFanOut() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !deckRef.current) return;

    // GSAP Context for clean cleanup on unmount
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth <= 1024 && !isMobile;

      // Card spread calculation based on screen width
      const spreadX = isMobile ? 65 : isTablet ? 155 : 220;
      const rotAngle = isMobile ? 5.5 : 7.5;

      // Master Timeline scrubbed directly to scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 1.1, // 1.1s momentum smoothing
          anticipatePin: 1,
        },
      });

      // Step 1: Deck enters from bottom into compact bundled center
      tl.fromTo(
        cardsRef.current,
        {
          y: 220,
          opacity: 0,
          scale: 0.88,
        },
        {
          y: (i) => (i - 2) * 3,
          x: (i) => (i - 2) * 2,
          opacity: 1,
          scale: 0.96,
          duration: 0.9,
          ease: 'power2.out',
          stagger: 0.04,
        }
      );

      // Step 2: The Deck fans out into a majestic curved arc
      tl.to(
        cardsRef.current,
        {
          x: (i) => (i - 2) * spreadX,
          y: (i) => {
            const arcDist = Math.abs(i - 2);
            return arcDist === 0 ? -18 : arcDist === 1 ? 8 : 34;
          },
          rotation: (i) => (i - 2) * rotAngle,
          scale: 1,
          duration: 1.5,
          ease: 'power3.inOut',
        },
        '+=0.15'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Card hover handling
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        scale: 1.08,
        y: '-=24',
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    setHoveredIndex(null);
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        scale: 1,
        y: '+=24',
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  return (
    <div ref={containerRef} className="gsap-fanout-pin-wrapper">
      <div className="gsap-fanout-stage">
        
        {/* Section Header */}
        <div className="fanout-header">
          <div className="header-meta">
            <span className="header-tag">[ 02 // SELECTED WORKS ]</span>
            <h2 className="header-title">Featured Projects & Systems</h2>
            <p className="header-sub">
              Scroll down to watch the cards fan out. Hover any card to inspect.
            </p>
          </div>
        </div>

        {/* The Animated GSAP Deck Stage */}
        <div ref={deckRef} className="gsap-card-stage">
          <div className="gsap-card-center-pivot">
            {PROJECTS.map((project, index) => {
              const isHovered = hoveredIndex === index;
              const defaultZ = index === 2 ? 10 : index === 1 || index === 3 ? 5 : 2;

              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className={`work-card ${isHovered ? 'hovered' : ''}`}
                  style={{
                    zIndex: isHovered ? 50 : defaultZ,
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  {/* Top Glass Tag */}
                  <div className="card-glass-top">
                    <span className="card-project-tag">{project.tag}</span>
                    <span
                      className="card-accent-dot"
                      style={{ backgroundColor: project.accent }}
                    ></span>
                  </div>

                  {/* Card Visual Showcase */}
                  <div className="card-image-wrap">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="card-img"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/visuals.jpg';
                      }}
                    />
                    <div className="card-img-overlay"></div>
                  </div>

                  {/* Bottom Meta Content */}
                  <div className="card-info-bottom">
                    <span className="card-category">{project.category}</span>
                    <h3 className="card-project-title">{project.title}</h3>
                    <p className="card-project-desc">{project.description}</p>

                    {/* Stack Badges */}
                    <div className="card-stack-pills">
                      {project.stack.map((item, sIndex) => (
                        <span key={sIndex} className="mini-pill">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
