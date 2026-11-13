import './App.css';
import Navbar from './components/Navbar';
import StaggeredReelPortfolio from './components/StaggeredReelPortfolio';
import WhatIDoSection from './components/WhatIDoSection';
import ProjectCardFanOut from './components/ProjectCardFanOut';
import MotionVideoTheater from './components/MotionVideoTheater';
import AboutMeSection from './components/AboutMeSection';
import ContactSection from './components/ContactSection';

export default function App() {
  return (
    <div className="isolated-stage">
      <Navbar />
      <div id="hero">
        <StaggeredReelPortfolio text="PORTFOLIO" />
      </div>
      <div id="what-i-do">
        <WhatIDoSection />
      </div>
      <div id="projects">
        <ProjectCardFanOut />
      </div>
      <div id="motion-videos">
        <MotionVideoTheater />
      </div>
      <div id="about">
        <AboutMeSection />
      </div>
      <ContactSection />
    </div>
  );
}
