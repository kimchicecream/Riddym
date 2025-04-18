import { useEffect, useState } from "react";
import './ParticleBackground.css';

function ParticleBackground({ hue }) {
    const [particles, setParticles] = useState([]);
    const NUM_PARTICLES = 250;

    useEffect(() => {
        const newParticles = Array.from({ length: NUM_PARTICLES }, () => {
            const size = Math.random() * 5 + 5;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 200 + 150;

            const maxOpacity = Math.random() * 0.6 + 0.3;

            return { size, left, top, duration, delay, angle, distance, maxOpacity };
        });
        setParticles(newParticles);
    }, []);

    const currentColor = `hsl(${hue}, 100%, 50%)`;

    return (
        <div className="particle-container">
            {particles.map((particle, i) => (
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
                        "--translateX": `${particle.distance * Math.cos(particle.angle)}px`,
                        "--translateY": `${particle.distance * Math.sin(particle.angle)}px`,
                        "--maxOpacity": particle.maxOpacity,
                        backgroundColor: currentColor,
                        boxShadow: `0 0 20px 5px ${currentColor}`,
                    }}
                />
            ))}
        </div>
    );
}

export default ParticleBackground;
