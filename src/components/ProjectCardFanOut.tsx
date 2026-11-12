import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProjectCardFanOut.css';

gsap.registerPlugin(ScrollTrigger);

// 6 Full-Bleed Editorial Visual Cards (Pure Images, No Text Bloat)
const CARD_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/visuals.jpg',
    alt: 'Editorial Fashion 01',
    label: '01',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/visuals.jpg',
    alt: 'Bespoke Atelier 02',
    label: '02',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/Main-character.webp',
    alt: 'Cinematic Character 03',
    label: '03',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/visuals.jpg',
    alt: '3D Fluid Motion 04',
    label: '04',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/visuals.jpg',
    alt: 'Creative Suite 05',
    label: '05',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    fallback: '/assets/visuals.jpg',
    alt: 'Cyber Architecture 06',
    label: '06',
  },
];

interface ProjectCardFanOutProps {
  headline?: string;
}

export default function ProjectCardFanOut({
  headline = 'Featured Projects & Systems',
}: ProjectCardFanOutProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, [hasStartedTypewriter]);

  // Typewriter character typing loop
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

  // GSAP ScrollTrigger Choreography:
  // 1. Deck Arrives in Center
  // 2. Fans Out into Curved Arc
  // 3. Smoothly Straightens into Tight Horizontal Carousel
  // 4. Horizontal Track Glides smoothly across the viewport
  useEffect(() => {
    if (!wrapperRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth <= 1024 && !isMobile;

      // Card dimensions & tight spacing
      const cardW = isMobile ? 150 : isTablet ? 180 : 215;
      const cardGap = isMobile ? 12 : isTablet ? 16 : 20; // tight space between cards
      const cardPitch = cardW + cardGap;

      // Fan-out parameters
      const fanStepX = isMobile ? 42 : isTablet ? 110 : 155;
      const fanAngle = isMobile ? 4.2 : 6.5;

      // Track horizontal glide distance
      const totalTrackWidth = 6 * cardPitch - cardGap;
      const viewportW = window.innerWidth;
      const overflow = Math.max(0, totalTrackWidth - viewportW + (isMobile ? 48 : 120));
      const slideDistance = isMobile ? overflow * 0.85 : Math.max(overflow, 280);

      // Master ScrollTrigger timeline pinned in place
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
        },
      });

      // 1. Initial State: Deck arrives in center as tightly bundled cards
      tl.fromTo(
        cardsRef.current,
        {
          y: 120,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: (i) => (i - 2.5) * 2,
          x: (i) => (i - 2.5) * 2,
          rotation: (i) => (i - 2.5) * 1.5,
          opacity: 1,
          scale: 0.96,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.02,
        }
      );

      // 2. The Fan-Out: Expands into signature curved arc below text
      tl.to(
        cardsRef.current,
        {
          x: (i) => (i - 2.5) * fanStepX,
          y: (i) => {
            const dist = Math.abs(i - 2.5);
            return dist * dist * (isMobile ? 5 : 8) + 12;
          },
          rotation: (i) => (i - 2.5) * fanAngle,
          scale: 1,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        '+=0.1'
      );

      // 3. Straighten into Tight Horizontal Carousel Row
      // (rotation drops to 0, y aligns to 0, x aligns to exact compact cardPitch)
      tl.to(
        cardsRef.current,
        {
          x: (i) => (i - 2.5) * cardPitch,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        '+=0.2'
      );

      // 4. Smooth Carousel Glide: Track translates horizontally so all cards are revealed
      tl.fromTo(
        trackRef.current,
        {
          x: slideDistance * 0.45,
        },
        {
          x: -slideDistance * 0.45,
          duration: 1.8,
          ease: 'none',
        },
        '+=0.05'
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  // Card hover lift with spring smoothing
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        scale: 1.05,
        y: '-=14',
        duration: 0.3,
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
        y: '+=14',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  return (
    <div ref={wrapperRef} className="card-fanout-pin-wrapper">
      <div className="card-fanout-stage">

        {/* 1. Centered Typewriter Headline */}
        <div className="fanout-typewriter-header">
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

        {/* 2. The Card Deck & Carousel Track */}
        <div className="card-fanout-deck-area">
          <div ref={trackRef} className="card-fanout-deck">
            {CARD_IMAGES.map((card, index) => {
              const isHovered = hoveredIndex === index;
              const dist = Math.abs(index - 2.5);
              const defaultZ = 20 - Math.round(dist * 3);

              return (
                <div
                  key={card.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className={`pure-visual-card ${isHovered ? 'hovered' : ''}`}
                  style={{
                    zIndex: isHovered ? 60 : defaultZ,
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  <img
                    src={card.url}
                    alt={card.alt}
                    className="pure-card-image"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = card.fallback;
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
