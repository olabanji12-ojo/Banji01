import { useEffect, useRef, useState } from 'react';
import './HeroTypography3D.css';

interface HeroTypography3DProps {
  primaryText?: string;
  taglineLeft?: string;
  taglineRight?: string;
}

export default function HeroTypography3D({
  primaryText = 'PORTFOLIO',
  taglineLeft = 'OLABANJI OJO',
  taglineRight = 'SOFTWARE ENGINEER & VIDEO CREATOR',
}: HeroTypography3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setCoords({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Compute 3D rotation angles and layer offsets based on mouse coordinates
  const rotateX = -coords.y * 14;
  const rotateY = coords.x * 16;
  const layer1OffsetX = coords.x * 12;
  const layer1OffsetY = coords.y * 12;
  const layer2OffsetX = coords.x * 24;
  const layer2OffsetY = coords.y * 24;

  return (
    <div className="hero-typo-wrapper" ref={containerRef}>
      {/* Top Graphic Header */}
      <div className="typo-top-bar">
        <div className="typo-eyebrow">
          <span className="dot-cross">✦</span>
          <span>WELCOME TO MY</span>
        </div>
        <div className="typo-badge">
          <span>VOL. 2026 // CLASS OF 2026</span>
          <span className="icon-target">✛</span>
        </div>
      </div>

      {/* 3D Kinetic Text Canvas */}
      <div
        className="typo-stage"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Editorial Vertical Graphic Block Behind Text (from Video 1) */}
        <div
          className="typo-pillar"
          style={{
            transform: `translateZ(-40px) translate(${coords.x * -8}px, ${coords.y * -8}px)`,
          }}
        />

        {/* Deep Outline Layer 2 */}
        <h1
          className="typo-layer typo-outline-back"
          style={{
            transform: `translateZ(-30px) translate(${layer2OffsetX}px, ${layer2OffsetY}px)`,
          }}
          aria-hidden="true"
        >
          {primaryText}
        </h1>

        {/* Mid Stroke Layer 1 */}
        <h1
          className="typo-layer typo-outline-mid"
          style={{
            transform: `translateZ(10px) translate(${layer1OffsetX}px, ${layer1OffsetY}px)`,
          }}
          aria-hidden="true"
        >
          {primaryText}
        </h1>

        {/* Foreground Solid Black Layer */}
        <h1
          className="typo-layer typo-solid-front"
          style={{
            transform: 'translateZ(45px)',
          }}
        >
          {primaryText}
        </h1>

        {/* Floating Technical Crosshairs */}
        <span
          className="crosshair ch-tl"
          style={{ transform: `translateZ(20px) translate(${coords.x * -6}px, ${coords.y * -6}px)` }}
        >
          +
        </span>
        <span
          className="crosshair ch-tr"
          style={{ transform: `translateZ(20px) translate(${coords.x * 6}px, ${coords.y * -6}px)` }}
        >
          +
        </span>
        <span
          className="crosshair ch-bl"
          style={{ transform: `translateZ(20px) translate(${coords.x * -6}px, ${coords.y * 6}px)` }}
        >
          +
        </span>
        <span
          className="crosshair ch-br"
          style={{ transform: `translateZ(20px) translate(${coords.x * 6}px, ${coords.y * 6}px)` }}
        >
          +
        </span>
      </div>

      {/* Bottom Editorial Meta Bar */}
      <div className="typo-bottom-bar">
        <span className="typo-author">{taglineLeft}</span>
        <span className="typo-divider">/</span>
        <span className="typo-role">{taglineRight}</span>
      </div>
    </div>
  );
}
