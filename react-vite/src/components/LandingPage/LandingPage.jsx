import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Aurora from '../Aurora/Aurora.jsx';
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

      gsap.to('.hero-text .line', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
        stagger: 0.5, // Animate one after another
        delay: 0.6,   // Wait a bit after load
      });

      gsap.to('.hero-text-glow', {
        opacity: 1,
        scale: 1.4,
        duration: 1.5,
        delay: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to('.hero-text-glow', {
            scale: 1.5,
            opacity: 0.3,
            duration: 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
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
      <div className="aurora-layer">
        {/* <Aurora
          colorStops={["#5100ff", "#5f4aff", "#7370fa"]}
          blend={0.5}
          amplitude={1}
          speed={0.1}
        /> */}
      </div>
        <div className="hero-text-glow" />
        <div className="hero-text">
          <h1>
            <span className="line">Play through music,</span><br />
            <span className="line">one note at a time.</span>
          </h1>
        </div>
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
