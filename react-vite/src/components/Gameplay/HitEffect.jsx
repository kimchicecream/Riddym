import React, { useEffect, useState, useRef } from "react";
import "./HitEffect.css";

const HitEffect = ({ isActive }) => {
    const [active, setActive] = useState(false);
    const [sparkles, setSparkles] = useState([]);
    const didLogRef = useRef(false);

    useEffect(() => {
        if (isActive) {
            if (!didLogRef.current) {
                console.log(`🔥 HitEffect Triggered for a note! (Lane Effect State: ${isActive})`);
                didLogRef.current = true;
            }
            setActive(true);

            // Generate 3 sparkles
            setSparkles([...Array(3)].map((_, i) => ({
                id: i,
                size: Math.random() * 12 + 30,
                left: Math.random() * 80,
                delay: i * 0.1,
            })));

            setTimeout(() => {
                setActive(false);
                setSparkles([]);
            }, 1000);
        } else {
            didLogRef.current = false;
        }
    }, [isActive]);

    return (
        <div className={`hit-effect ${active ? "active" : ""}`}>
            <div className="glow"></div>
            {sparkles.map((sparkle) => (
                <svg
                    key={sparkle.id}
                    className="sparkle"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        animationDelay: `${sparkle.delay}s`,
                        width: `${sparkle.size}px`,
                        left: `${sparkle.left}px`,
                    }}
                >
                    <path d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z" />
                </svg>
            ))}
        </div>
    );
};

export default HitEffect;
