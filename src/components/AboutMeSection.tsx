import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutMeSection.css';

gsap.registerPlugin(ScrollTrigger);

const STORY_PARAGRAPHS = [
  "I'm Banji, to be honest, I'm really glad you made it here.",
  "I've been programming since 2023. Starting out with just my laptop, YouTube videos, and documentation, I taught myself software engineering from scratch—building clean backend APIs, databases, and modern web apps.",
  "Earlier this year, I stumbled into programmatic video and asked: 'What is Remotion? Can code really make videos like this?' I tested it out, fell in love with code-driven motion, and started creating animated product demos and reels with Remotion, Hyperframes, Codex, and Antigravity.",
];

export default function AboutMeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordSpansRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Split each paragraph into words with paragraph markers
  let wordIndexCounter = 0;
  const tokenizedParagraphs = STORY_PARAGRAPHS.map((p) => {
    return p.split(' ').map((word) => {
      const idx = wordIndexCounter++;
      return { word, index: idx };
    });
  });

  // Word-by-word reveal on scroll
  useEffect(() => {
    if (!sectionRef.current || wordSpansRef.current.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordSpansRef.current,
        {
          opacity: 0.15,
          y: 6,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.025,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'center 45%',
            scrub: 1.1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about-me" className="about-me-section">
      <div className="about-me-container">

        {/* LEFT COLUMN: Banji's Real Portrait */}
        <div className="about-left-col">
          <div className="about-image-card">
            <div className="about-image-frame">
              <img
                src="/assets/banji.jpg"
                alt="Olabanji Ojo"
                className="about-profile-img"
              />
              <div className="about-image-overlay" />
            </div>

            {/* Credential Badge */}
            <div className="about-image-badge">
              <span className="about-badge-role">Ojo Emmanuel Olabanji</span>
              <span className="about-badge-sub">B.Sc. Computer Science • Class of 2026</span>
            </div>

            {/* Fun Fact Badges Under Photo */}
            <div className="about-fun-facts">
              <span className="fun-fact-chip">
                <span>🎸</span> Acoustic Guitar (Still Learning)
              </span>
              <span className="fun-fact-chip">
                <span>📐</span> Mathematics &amp; Physics Tutor
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Story (Word by Word) & Work Experience */}
        <div className="about-right-col">
          <div className="about-header-meta">
            <span className="about-section-badge">[ 04 // THE STORY &amp; JOURNEY ]</span>
            <h2 className="about-headline">From Self-Taught Code to Programmatic Motion.</h2>
          </div>

          {/* Word-by-Word Animated Story Text */}
          <div className="about-story-text-flow">
            {tokenizedParagraphs.map((paraWords, pIdx) => (
              <p key={pIdx} className="story-paragraph">
                {paraWords.map(({ word, index }) => (
                  <span
                    key={index}
                    ref={(el) => {
                      wordSpansRef.current[index] = el;
                    }}
                    className="about-word"
                  >
                    {word}&nbsp;
                  </span>
                ))}
              </p>
            ))}
          </div>

          {/* Work Experience Timeline */}
          <div className="about-experience-section">
            <h3 className="experience-title">Where I've Built &amp; Contributed</h3>

            <div className="experience-cards-grid">
              {/* 1. Brookes Automation (Current) */}
              <div className="experience-card current">
                <div className="exp-card-header">
                  <div>
                    <h4 className="exp-company-name">Brookes Automation</h4>
                    <span className="exp-role">Motion Video Specialist &amp; Web Features</span>
                  </div>
                  <span className="exp-badge current">Current</span>
                </div>
                <p className="exp-description">
                  Create product videos, motion reels, and interactive features on their website.
                </p>
                <div className="exp-tools">
                  <span className="exp-tool-pill">Remotion</span>
                  <span className="exp-tool-pill">Hyperframes</span>
                  <span className="exp-tool-pill">Codex</span>
                  <span className="exp-tool-pill">Antigravity</span>
                </div>
              </div>

              {/* 2. Render Africa (IT) */}
              <div className="experience-card">
                <div className="exp-card-header">
                  <div>
                    <h4 className="exp-company-name">Render Africa</h4>
                    <span className="exp-role">Backend Engineer (IT)</span>
                  </div>
                  <span className="exp-badge">Past Experience</span>
                </div>
                <p className="exp-description">
                  Worked mainly on the backend, building clean REST APIs and database logic for client systems.
                </p>
                <div className="exp-tools">
                  <span className="exp-tool-pill">Go</span>
                  <span className="exp-tool-pill">Python</span>
                  <span className="exp-tool-pill">Django</span>
                  <span className="exp-tool-pill">REST APIs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tutoring Humor / Note */}
          <div className="about-tutor-note">
            <span className="tutor-icon">💡</span>
            <p className="tutor-text">
              <strong>Fun fact:</strong> If you ever need a tutor for mathematics or physics, I've got you covered.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

