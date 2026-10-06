import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Publications from './components/Publications';
import Features from './components/Features';
import Team from './components/Team';
import Misc from './components/Misc';
import Gallery from './components/Gallery';
import RoadTrips from './components/RoadTrips';
import Footer from './components/Footer';
import SnapshotView from './components/SnapshotView';
import CoffeeApp from './coffee/CoffeeApp';

function App() {
  // Direct client-side route handling for /coffee
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/coffee')) {
    return <CoffeeApp />;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const snapshotId = urlParams.get('snapshot');

  if (snapshotId !== null) {
    return <SnapshotView id={parseInt(snapshotId, 10)} />;
  }
  useEffect(() => {
    // Set dark mode by default
    document.body.classList.add('dark-mode');

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle dark mode on 'd' or 'D', but ignore if user is typing in an input
      if ((e.key === 'd' || e.key === 'D') && e.target instanceof Element && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        document.body.classList.toggle('dark-mode');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="section-separator" />
        <Education />
        <div className="section-separator" />
        <Experience />
        <div className="section-separator" />
        <Team />
        <div className="section-separator" />
        <Features />
        <div className="section-separator" />
        <Publications />
        <div className="section-separator" />
        <Misc />
        
        <div id="personal" className="magazine-demarcator">
          <span className="magazine-subtitle">Part II</span>
          <div className="graphic-title">
            <span data-text="P">P</span>
            <span data-text="E">E</span>
            <span data-text="R">R</span>
            <span data-text="S">S</span>
            <span data-text="O">O</span>
            <span data-text="N">N</span>
            <span data-text="A">A</span>
            <span data-text="L">L</span>
          </div>
        </div>

        <Gallery />
        <div className="section-separator" />
        <RoadTrips />
      </main>
      <Footer />
    </>
  );
}

export default App;
