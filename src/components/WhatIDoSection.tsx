import { useEffect, useRef, useState } from 'react';
import './WhatIDoSection.css';

interface WhatIDoSectionProps {
  headline?: string;
}

export default function WhatIDoSection({
  headline = 'I build custom websites, web applications, and videos that stand out.',
}: WhatIDoSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = headline.split(' ');

  return (
    <section
      ref={sectionRef}
      className={`what-i-do-section ${isVisible ? 'in-view' : ''}`}
    >
      <div className="wid-centered-container">
        <h2 className="wid-word-by-word-headline">
          {words.map((word, index) => (
            <span key={index} className="word-wrapper">
              <span
                className="word-inner"
                style={{
                  transitionDelay: `${index * 0.08 + 0.1}s`,
                }}
              >
                {word}
              </span>
              {/* Maintain standard word spacing */}
              <span className="word-space">&nbsp;</span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
