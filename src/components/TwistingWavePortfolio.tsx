import { useEffect, useRef, useState } from 'react';
import './TwistingWavePortfolio.css';

interface TwistingWavePortfolioProps {
  text?: string;
}

export default function TwistingWavePortfolio({
  text = 'PORTFOLIO',
}: TwistingWavePortfolioProps) {
  const letters = text.split('');
  const [angle, setAngle] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const animRef = useRef<number | null>(null);

  // Tight bending radius - creates that continuous glued ribbon look with NO gap
  const BEND_RADIUS = 16; 

  // Twist along the word length
  const TOTAL_TWIST = Math.PI * 0.95;
  const TWIST_PER_LETTER = TOTAL_TWIST / (letters.length - 1);

  useEffect(() => {
    let currentAngle = 0;
    const animate = () => {
      // Smooth continuous wave rotation
      currentAngle += 0.024;
      setAngle(currentAngle);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Subtle interactive parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="twisting-stage-container">
      {/* 3D Perspective Stage */}
      <div
        className="twisting-stage"
        style={{
          transform: `perspective(800px) rotateY(${mouseOffset.x * 10}deg) rotateX(${-mouseOffset.y * 8}deg)`,
        }}
      >
        {/* LAYER 1: SOLID BLACK FOREGROUND (ALWAYS 100% VISIBLE & SHARP) */}
        <div className="text-strand strand-solid">
          {letters.map((char, i) => {
            const letterAngle = angle - i * TWIST_PER_LETTER;

            // Bending undulation in Y and Z
            const translateY = -Math.sin(letterAngle) * BEND_RADIUS;
            const translateZ = Math.cos(letterAngle) * BEND_RADIUS;

            // 3D Pitch tilt (rotateX) - creates the wave bending
            const rotateXDeg = Math.sin(letterAngle) * 32;

            // Subtle bank (rotateZ)
            const rotateZDeg = -Math.cos(letterAngle) * 6;

            // Subtle perspective foreshortening (keeps letters tall, never squashed to dashes)
            const cosVal = Math.cos(letterAngle);
            const scaleY = 0.88 + Math.abs(cosVal) * 0.12;

            return (
              <span
                key={`solid-${i}`}
                className="wave-letter letter-solid"
                style={{
                  transform: `translate3d(0, ${translateY}px, ${translateZ}px) rotateX(${rotateXDeg}deg) rotateZ(${rotateZDeg}deg) scaleY(${scaleY})`,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* LAYER 2: TRANSPARENT OUTLINE SHADOW (TIGHTLY GLUED TO SOLID WITH ZERO GAP) */}
        <div className="text-strand strand-outline">
          {letters.map((char, i) => {
            const letterAngle = angle - i * TWIST_PER_LETTER;

            // Offset just 6px to 8px directly behind the solid letter like a bent rim
            const translateY = -Math.sin(letterAngle) * BEND_RADIUS + (Math.cos(letterAngle) > 0 ? 8 : -8);
            const translateZ = Math.cos(letterAngle) * BEND_RADIUS - 10;

            const rotateXDeg = Math.sin(letterAngle) * 32;
            const rotateZDeg = -Math.cos(letterAngle) * 6;
            const cosVal = Math.cos(letterAngle);
            const scaleY = 0.88 + Math.abs(cosVal) * 0.12;

            return (
              <span
                key={`outline-${i}`}
                className="wave-letter letter-outline"
                style={{
                  transform: `translate3d(0, ${translateY}px, ${translateZ}px) rotateX(${rotateXDeg}deg) rotateZ(${rotateZDeg}deg) scaleY(${scaleY})`,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
