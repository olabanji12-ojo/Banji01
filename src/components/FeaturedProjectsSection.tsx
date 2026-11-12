import { useEffect, useRef, useState } from 'react';
import './FeaturedProjectsSection.css';

interface FeaturedProjectsSectionProps {
  text?: string;
}

export default function FeaturedProjectsSection({
  text = 'Featured Projects & Systems',
}: FeaturedProjectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Trigger typewriter when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  // Typewriter character typing loop
  useEffect(() => {
    if (!hasStarted) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 55); // 55ms per character for natural, rhythmic typing

    return () => clearInterval(interval);
  }, [hasStarted, text]);

  return (
    <section ref={sectionRef} className="featured-typewriter-section">
      <div className="typewriter-centered-container">
        <h2 className="typewriter-heading">
          <span>{displayText}</span>
          <span
            className={`typewriter-cursor ${isComplete ? 'blinking' : 'typing'}`}
          >
            _
          </span>
        </h2>
      </div>
    </section>
  );
}

