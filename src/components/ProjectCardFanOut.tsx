import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './ProjectCardFanOut.css';

// 6 Full-Bleed Editorial Visual Cards (Pure Images, No Text Bloat)
const ORIGINAL_CARDS = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/visuals.jpg',
    alt: 'Editorial Fashion 01',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/visuals.jpg',
    alt: 'Bespoke Atelier 02',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/Main-character.webp',
    alt: 'Cinematic Character 03',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/visuals.jpg',
    alt: '3D Fluid Motion 04',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/visuals.jpg',
    alt: 'Creative Suite 05',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/visuals.jpg',
    alt: 'Cyber Architecture 06',
  },
];

// Replicate 4 times for a seamless, gapless 360-degree infinite loop on any screen width
const LOOPING_CARDS = [
  ...ORIGINAL_CARDS.map((c, i) => ({ ...c, uniqueId: `set0-${i}` })),
  ...ORIGINAL_CARDS.map((c, i) => ({ ...c, uniqueId: `set1-${i}` })),
  ...ORIGINAL_CARDS.map((c, i) => ({ ...c, uniqueId: `set2-${i}` })),
  ...ORIGINAL_CARDS.map((c, i) => ({ ...c, uniqueId: `set3-${i}` })),
];

interface ProjectCardFanOutProps {
  headline?: string;
}

export default function ProjectCardFanOut({
  headline = 'Featured Projects & Systems',
}: ProjectCardFanOutProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
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

  // Infinite Seamless Looping Marquee
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Calculate width of exactly one set of 6 cards
    const firstSetCards = track.querySelectorAll('.carousel-card-item');
    if (firstSetCards.length < ORIGINAL_CARDS.length) return;

    let singleSetWidth = 0;
    for (let i = 0; i < ORIGINAL_CARDS.length; i++) {
      const card = firstSetCards[i] as HTMLElement;
      const style = window.getComputedStyle(card);
      const marginRight = parseFloat(style.marginRight) || 0;
      singleSetWidth += card.offsetWidth + marginRight;
    }

    // Default duration for one complete cycle
    const duration = 28; // Butter smooth continuous glide

    // Infinite GSAP tween
    const tween = gsap.to(track, {
      x: -singleSetWidth,
      duration: duration,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % singleSetWidth),
      },
    });

    tweenRef.current = tween;

    // Optional: Scroll velocity boost
    let lastScrollY = window.scrollY;
    let scrollTimeout: number | undefined;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      // Temporarily speed up during active scroll
      if (tweenRef.current) {
        const speedBoost = Math.min(3.5, 1 + delta * 0.04);
        gsap.to(tweenRef.current, {
          timeScale: speedBoost,
          duration: 0.2,
          overwrite: 'auto',
        });

        window.clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
          if (tweenRef.current) {
            gsap.to(tweenRef.current, {
              timeScale: 1,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        }, 120);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      tween.kill();
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(scrollTimeout);
    };
  }, []);

  // Smoothly pause/slow on hover
  const handleMouseEnter = (id: string) => {
    setHoveredId(id);
    if (tweenRef.current) {
      gsap.to(tweenRef.current, {
        timeScale: 0.15, // slows down gently rather than hard stopping
        duration: 0.4,
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    if (tweenRef.current) {
      gsap.to(tweenRef.current, {
        timeScale: 1,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  return (
    <section ref={sectionRef} className="project-carousel-section">
      {/* 1. Centered Typewriter Headline */}
      <div className="carousel-typewriter-header">
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
      </div>

      {/* 2. Seamless Infinite Looping Carousel Track */}
      <div className="carousel-track-container">
        {/* Soft edge masks for luxury fade-out */}
        <div className="carousel-fade-edge left" />
        <div className="carousel-fade-edge right" />

        <div ref={trackRef} className="carousel-track">
          {LOOPING_CARDS.map((card) => {
            const isHovered = hoveredId === card.uniqueId;

            return (
              <div
                key={card.uniqueId}
                className={`carousel-card-item ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => handleMouseEnter(card.uniqueId)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="carousel-card-inner">
                  <img
                    src={card.url}
                    alt={card.alt}
                    className="carousel-card-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = card.fallback;
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
