import './App.css';
import Navbar from './components/Navbar';
import StaggeredReelPortfolio from './components/StaggeredReelPortfolio';
import WhatIDoSection from './components/WhatIDoSection';
import ProjectCardFanOut from './components/ProjectCardFanOut';

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
    </div>
  );
}
