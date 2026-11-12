import { useEffect, useRef, useState } from 'react';
import './RollingPortfolio3D.css';

interface RollingPortfolio3DProps {
  text?: string;
}

export default function RollingPortfolio3D({
  text = 'PORTFOLIO',
}: RollingPortfolio3DProps) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const isHovered = useRef(false);

  // We place 8 text facets around the cylinder (360 / 8 = 45 deg step)
  const FACET_COUNT = 8;
  const ANGLE_STEP = 360 / FACET_COUNT;
  const RADIUS = 140;

  // Continuous loop animation
  useEffect(() => {
    let animId: number;
    let currentAngle = 0;

    const loop = () => {
      // Rotate steadily downward like a rolling drum
      currentAngle = (currentAngle + 0.35) % 360;
      setRotationAngle(currentAngle);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Subtle interactive parallax tilt based on mouse position
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

  const items = Array.from({ length: FACET_COUNT }, (_, index) => {
    const facetAngle = (index * ANGLE_STEP + rotationAngle) % 360;
    const normalizedAngle = ((facetAngle + 180) % 360) - 180;
    const isFront = Math.abs(normalizedAngle) < 90;
    const centerProximity = Math.max(0, Math.cos((normalizedAngle * Math.PI) / 180));
    const isCenter = Math.abs(normalizedAngle) < 22.5;

    return {
      index,
      angle: facetAngle,
      normalizedAngle,
      isFront,
      isCenter,
      centerProximity,
    };
  });

  return (
    <div
      className="rolling-portfolio-stage"
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      {/* 3D Cylinder Viewport */}
      <div
        className="cylinder-viewport"
        style={{
          transform: `perspective(900px) rotateY(${mouseOffset.x * 12}deg) rotateZ(${mouseOffset.x * -2}deg)`,
        }}
      >
        {/* The Rolling 3D Drum */}
        <div
          className="cylinder-drum"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${-rotationAngle}deg)`,
          }}
        >
          {Array.from({ length: FACET_COUNT }).map((_, i) => {
            const angle = i * ANGLE_STEP;
            const item = items[i];

            return (
              <div
                key={i}
                className={`cylinder-strip ${item.isCenter ? 'strip-solid' : 'strip-outline'}`}
                style={{
                  transform: `rotateX(${angle}deg) translateZ(${RADIUS}px)`,
                  opacity: item.isFront ? Math.max(0.18, item.centerProximity) : 0,
                }}
              >
                <span className="strip-text">{text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
