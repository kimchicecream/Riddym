import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './LandingPage.css';

function LandingPage() {
  const laneRefs = useRef([]);
  const fadeRef = useRef(null);

  useEffect(() => {
    laneRefs.current.forEach((lane) => {
      lane.innerHTML = '';
      const note = document.createElement('div');
      note.className = 'note';
      lane.appendChild(note);

      const stopPercent = 20 + Math.random() * 75; // 20% to 75%

      gsap.fromTo(note, { top: '-30px' }, {
        top: `${stopPercent}%`,
        duration: 1.8 + Math.random(),
        ease: 'power2.out'
      });
    });

    if (fadeRef.current) {
      gsap.to(fadeRef.current, {
        opacity: 1,
        duration: 1.5,
        delay: 0.1,
        ease: 'power1.out'
      });
    }
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
      <div className="fade-overlay" ref={fadeRef} />
    </div>
      <div className='second-block'>

      </div>
    </div>
  );
}

export default LandingPage;
