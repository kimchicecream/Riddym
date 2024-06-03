import './Timestamps.css';

const Timestamps = ({ duration }) => {
    const intervals = Array.from({ length: Math.ceil(duration / 10) }, (_, i) => i * 10);

    return (
        <div className="timestamps">
            {intervals.map((time, index) => (
                <div key={index} className="timestamp" style={{ left: `${(time / duration) * 100}%` }}>
                    {new Date(time * 1000).toISOString().substr(11, 8)}
                </div>
            ))}
        </div>
    );
};

export default Timestamps;
