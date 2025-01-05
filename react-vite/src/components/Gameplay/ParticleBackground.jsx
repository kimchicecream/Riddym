import { useEffect, useState } from "react";
import './ParticleBackground.css';

function ParticleBackground() {
    const [particles, setParticles] = useState([]);
    const NUM_PARTICLES = 50;

    useEffect(() => {
        const newParticles = Array.from({ length: NUM_PARTICLES }, () => {
            const size = Math.random() * 5 * 5;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            return ( size, left, top, duration, delay );
        });
        setParticles(newParticles);
    }, []);

    return (
        <div className="particle-container">
            {particles/map((particle, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.left}vw`,
                        top: `${particle.top}vh`,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${particle.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}

export default ParticleBackground;
