import './App.css';
import StaggeredReelPortfolio from './components/StaggeredReelPortfolio';
import WhatIDoSection from './components/WhatIDoSection';
import FeaturedProjectsSection from './components/FeaturedProjectsSection';

export default function App() {
  return (
    <div className="isolated-stage">
      <StaggeredReelPortfolio text="PORTFOLIO" />
      <WhatIDoSection />
      <FeaturedProjectsSection />
    </div>
  );
}
