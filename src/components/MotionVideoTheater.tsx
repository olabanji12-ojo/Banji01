import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MotionVideoTheater.css';

gsap.registerPlugin(ScrollTrigger);

interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tools: string[];
  videoSrc: string;
}

const MOTION_VIDEOS: VideoItem[] = [
  {
    id: 'tailor-voice',
    title: "Tailor's Voice Walkthrough",
    subtitle: 'End-to-end bespoke tailoring measurement workflow and kinetic product tour.',
    category: 'Product Story',
    tools: ['Remotion', 'Codex', 'Figma'],
    videoSrc: '/videos/tailor-voice.mp4',
  },
  {
    id: 'product-reel',
    title: 'Commercial Product Reel',
    subtitle: 'High-energy 3D commercial motion, typography pacing & fluid product reveal.',
    category: 'Commercial Reel',
    tools: ['Hyperframes', 'Premiere Pro', 'Antigravity'],
    videoSrc: '/videos/product-reel.mp4',
  },
  {
    id: 'app-showcase',
    title: 'App Interaction Demo',
    subtitle: 'Interactive mobile interface physics, gesture feedback & UI storytelling.',
    category: 'App Showcase',
    tools: ['Remotion', 'TypeScript', 'Antigravity'],
    videoSrc: '/videos/app-showcase.mp4',
  },
  {
    id: 'antigravity-2026',
    title: 'Antigravity 2026 Exploration',
    subtitle: 'Experimental AI-driven video synthesis pipeline and cinematic 3D lighting.',
    category: '3D & AI Video',
    tools: ['AI Video', 'Three.js', 'Codex'],
    videoSrc: '/videos/antigravity-2026.mp4',
  },
];

const HEADLINE_TEXT = 'Automated Video Pipelines & Motion Direction';

const SUBHEADER_TEXT =
  'High-impact product videos, kinetic app demos, and programmatic motion directed with Remotion, Hyperframes, Codex & Antigravity.';

export default function MotionVideoTheater() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subheadWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Audio state: only 1 unmuted video at a time
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);

  // Fullscreen Cinema Modal
  const [activeModalVideo, setActiveModalVideo] = useState<VideoItem | null>(null);

  const headlineWords = HEADLINE_TEXT.split(' ');
  const subheaderWords = SUBHEADER_TEXT.split(' ');

  // 1. Word-by-Word Reveal for Heading & Subheader via ScrollTrigger
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading word-by-word reveal
      if (headlineWordsRef.current.length > 0) {
        gsap.fromTo(
          headlineWordsRef.current,
          {
            opacity: 0.15,
            y: 12,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1.1,
            },
          }
        );
      }

      // Subheader word-by-word reveal
      if (subheadWordsRef.current.length > 0) {
        gsap.fromTo(
          subheadWordsRef.current,
          {
            opacity: 0.2,
            y: 8,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.03,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'top 40%',
              scrub: 1.1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 2. IntersectionObserver: Only play videos when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);

  // Handle Mute / Unmute Toggle
  const toggleSound = (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    e.preventDefault();

    if (unmutedVideoId === videoId) {
      // Mute it
      setUnmutedVideoId(null);
      const currentVideo = videoRefs.current[videoId];
      if (currentVideo) currentVideo.muted = true;
    } else {
      // Unmute this video, ensure all other videos are muted
      Object.entries(videoRefs.current).forEach(([id, vid]) => {
        if (vid) {
          if (id === videoId) {
            vid.muted = false;
            vid.play().catch(() => {});
          } else {
            vid.muted = true;
          }
        }
      });
      setUnmutedVideoId(videoId);
    }
  };

  const openModal = (video: VideoItem) => {
    setActiveModalVideo(video);
  };

  const closeModal = () => {
    setActiveModalVideo(null);
  };

  return (
    <section ref={sectionRef} id="motion-videos" className="motion-theater-section">
      <div className="motion-theater-container">

        {/* Section Header */}
        <div className="motion-header">
          <span className="motion-header-badge">[ 03 // MOTION DESIGN &amp; DIRECTION ]</span>

          {/* Word-by-Word Animated Heading */}
          <h2 className="motion-headline">
            {headlineWords.map((word, i) => (
              <span
                key={i}
                ref={(el) => {
                  headlineWordsRef.current[i] = el;
                }}
                className="headline-word"
              >
                {word}
              </span>
            ))}
          </h2>

          {/* Word-by-Word Animated Subheader */}
          <p className="motion-animated-subhead">
            {subheaderWords.map((word, i) => (
              <span
                key={i}
                ref={(el) => {
                  subheadWordsRef.current[i] = el;
                }}
                className="subhead-word"
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Native 9:16 Vertical Video Reel Gallery (4 Columns on Desktop, 2x2 on Tablet, 1 on Mobile) */}
        <div className="motion-vertical-reel-grid">
          {MOTION_VIDEOS.map((video) => {
            const isUnmuted = unmutedVideoId === video.id;

            return (
              <div
                key={video.id}
                className="vertical-reel-card"
                onClick={() => openModal(video)}
              >
                {/* 9:16 Video Frame (Zero Cropping, Fits Native 1080x1920) */}
                <div className="reel-frame-9-16">
                  <video
                    ref={(el) => {
                      videoRefs.current[video.id] = el;
                    }}
                    src={video.videoSrc}
                    loop
                    muted={!isUnmuted}
                    playsInline
                    autoPlay
                    preload="metadata"
                    className="reel-video-element"
                  />

                  {/* Gradient Overlay for Top Badges & Controls */}
                  <div className="reel-viewport-gradient" />

                  {/* Top Bar: Category Tag & Sound Toggle */}
                  <div className="reel-top-bar">
                    <span className="reel-category-pill">{video.category}</span>

                    <button
                      type="button"
                      className={`reel-sound-toggle-btn ${isUnmuted ? 'is-active' : ''}`}
                      onClick={(e) => toggleSound(e, video.id)}
                      title={isUnmuted ? 'Click to Mute' : 'Click to Unmute Sound'}
                      aria-label={isUnmuted ? 'Mute audio' : 'Unmute audio'}
                    >
                      {isUnmuted ? (
                        <>
                          <span className="sound-wave-bars">
                            <span className="bar bar-1" />
                            <span className="bar bar-2" />
                            <span className="bar bar-3" />
                          </span>
                          <span className="sound-text">Sound On</span>
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                          </svg>
                          <span className="sound-text">Sound Off</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Netflix-Style Expand Hint on Hover */}
                  <div className="reel-expand-hint">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    <span>Click to Expand</span>
                  </div>
                </div>

                {/* Card Meta Content - Clean Left Aligned */}
                <div className="reel-card-meta">
                  <h3 className="reel-title">{video.title}</h3>
                  <p className="reel-desc">{video.subtitle}</p>

                  {/* Motion Tools Tags */}
                  <div className="reel-tools-row">
                    {video.tools.map((tool) => (
                      <span key={tool} className="reel-tool-badge">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Cinema Modal */}
      {activeModalVideo && (
        <div className="cinema-modal-backdrop" onClick={closeModal}>
          <div className="cinema-modal-box vertical-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="cinema-close-btn"
              onClick={closeModal}
              aria-label="Close Cinema"
            >
              ✕
            </button>
            <div className="cinema-vertical-frame">
              <video
                src={activeModalVideo.videoSrc}
                controls
                autoPlay
                className="cinema-vertical-player"
              />
            </div>
            <div className="cinema-info-row">
              <div>
                <h4 className="cinema-title">{activeModalVideo.title}</h4>
                <p className="cinema-desc">{activeModalVideo.subtitle}</p>
              </div>
              <div className="cinema-tools-row">
                {activeModalVideo.tools.map((t) => (
                  <span key={t} className="reel-tool-badge">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
