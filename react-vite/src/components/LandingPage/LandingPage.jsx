import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './LandingPage.css';

function LandingPage() {
  const laneRefs = useRef([]);

  useEffect(() => {
    laneRefs.current.forEach((lane, i) => {
      lane.innerHTML = '';

      const note = document.createElement('div');
      note.className = 'note';

      lane.appendChild(note);

      const stopPercent = 20 + Math.random() * 70; // between 20% and 90%

      gsap.fromTo(
        note,
        { top: '-30px' },
        {
          top: `${stopPercent}%`,
          duration: 1.8 + Math.random(),
          ease: 'power2.out',
        }
      );
    });
  }, []);

  return (
    <div className="landing-page-container">
      <div className="hero-container">
        <div className="mock-lanes-container">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="mock-lane"
              ref={(el) => (laneRefs.current[i] = el)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
