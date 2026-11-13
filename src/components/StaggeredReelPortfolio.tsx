import { useEffect, useRef } from 'react';
import './StaggeredReelPortfolio.css';

interface StaggeredReelPortfolioProps {
  text?: string;
  animeImageSrc?: string;
}

export default function StaggeredReelPortfolio({
  text = 'PORTFOLIO',
  animeImageSrc = '/assets/Main-character.webp',
}: StaggeredReelPortfolioProps) {
  const letters = text.split('');
  const animRef = useRef<number | null>(null);

  // Velocity & rotation references
  const currentRotationRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const drumsRef = useRef<(HTMLDivElement | null)[]>([]);

  const ITEM_COUNT = 4;
  const ANGLE_STEP = 360 / ITEM_COUNT; // 90 deg

  useEffect(() => {
    let lastTime = performance.now();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const deltaY = Math.abs(scrollY - lastScrollYRef.current);
      lastScrollYRef.current = scrollY;
      scrollVelocityRef.current = Math.min(scrollVelocityRef.current + deltaY * 0.08, 14);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 60 FPS Continuous 3D Staggered Reel Animation Loop
    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Decay scroll velocity smoothly back to idle
      scrollVelocityRef.current += (0 - scrollVelocityRef.current) * 0.06;

      // Continuous rotation: base idle speed + scroll boost
      const speed = 1.3 + scrollVelocityRef.current * 4.5;
      currentRotationRef.current += speed * dt * 50;

      const currentAngle = currentRotationRef.current;

      // Update 3D drum rotations directly on DOM
      drumsRef.current.forEach((drum, colIndex) => {
        if (!drum) return;
        const colPhase = currentAngle - colIndex * 22; // 22 deg stagger wave between columns
        drum.style.transform = `rotateX(${-colPhase}deg)`;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="hero-page-wrapper">
      <div className="hero-content-container">

        {/* 1. TOP: WELCOME TO MY - Cascade Step 1 */}
        <div className="intro-lead-text flow-item step-1">
          WELCOME TO MY
        </div>

        {/* 2. CENTER: 3D Rolling Staggered PORTFOLIO - Cascade Step 2 */}
        <div className="staggered-portfolio-container flow-item step-2">
          <div className="staggered-row">
            {letters.map((char, colIndex) => (
              <div key={colIndex} className="letter-reel-column">
                <div
                  className="letter-reel-drum"
                  ref={(el) => {
                    drumsRef.current[colIndex] = el;
                  }}
                >
                  {Array.from({ length: ITEM_COUNT }).map((_, itemIndex) => {
                    const facetAngle = itemIndex * ANGLE_STEP;
                    const isSolid = itemIndex % 2 === 0;

                    return (
                      <div
                        key={itemIndex}
                        className={`reel-facet ${isSolid ? 'facet-solid' : 'facet-outline'}`}
                        style={{
                          transform: `rotateX(${facetAngle}deg) translateZ(var(--reel-radius, 52px))`,
                        }}
                      >
                        <span className="facet-char">{char}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. CENTERPIECE: Big Anime Character Showcase - Cascade Step 3 */}
        <div className="anime-avatar-wrapper flow-item step-3">
          <div className="anime-avatar-frame">
            <img
              src={animeImageSrc}
              alt="Anime Character"
              className="anime-avatar-img"
            />
          </div>
        </div>

        {/* 4. BOTTOM: I'm Olabanji Ojo, nice to have you here. - Cascade Step 4 */}
        <div className="intro-sub-text flow-item step-4">
          I'm Olabanji Ojo, nice to have you here.
        </div>

      </div>
    </div>
  );
}
