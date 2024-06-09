import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrackById } from '../../redux/tracks';
import './Gameplay.css';

function Gameplay() {
    const { trackId } = useParams();
    const dispatch = useDispatch();
    const track = useSelector(state => state.tracks.allTracks[trackId]);
    const [fallingNotes, setFallingNotes] = useState([]);
    const [activeZones, setActiveZones] = useState([false, false, false, false, false]);
    const [gameStarted, setGameStarted] = useState(false);
    const [hitNotes, setHitNotes] = useState(new Set());
    const waveSurferRef = useRef(null);
    const startTimeRef = useRef(null);

    // keep page static
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
          document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        if (trackId) {
            dispatch(fetchTrackById(trackId));
        }
    }, [dispatch, trackId]);

    useEffect(() => {
        if (track && track.song && track.song.song_url && !waveSurferRef.current) {
            waveSurferRef.current = WaveSurfer.create({
                container: document.createElement('div'), // dummy element
                height: 0,
                normalize: true,
            });

            waveSurferRef.current.load(track.song.song_url);

            // Error handling for loading audio
            waveSurferRef.current.on('error', (e) => {
                console.error('WaveSurfer error:', e);
            });
        }
    }, [track]);

    useEffect(() => {
        if (gameStarted && track && track.notes) {
            const startTime = Date.now();
            startTimeRef.current = startTime;
            setFallingNotes(track.notes.map(note => ({
                ...note,
                uniqueId: `${note.id}-${Date.now()}`
            })));

            // Start the animation loop
            requestAnimationFrame(updateNotesPosition);
        }
    }, [gameStarted, track]);

    const updateNotesPosition = () => {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTimeRef.current) / 1000; // in seconds

        setFallingNotes(prevNotes => prevNotes.map(note => ({
            ...note,
            position: (elapsedTime - note.time) * 100 // adjust multiplier as needed
        })));

        if (gameStarted) {
            requestAnimationFrame(updateNotesPosition);
        }
    };

    const handleStartGame = async () => {
        setGameStarted(true);
        waveSurferRef.current.play();
    };

    const handleKeyPress = (laneIndex) => {
        // Check if there is a note in the hit zone
        const hitZonePosition = 90; // Adjust this value based on the actual position of the hit zone
        const hitNote = fallingNotes.find(note => note.lane === laneIndex && Math.abs(note.position - hitZonePosition) < 5);

        if (hitNote) {
            setHitNotes(prevHitNotes => new Set(prevHitNotes).add(hitNote.uniqueId));
        }

        // Activate hit zone
        setActiveZones(zones => {
            const newZones = [...zones];
            newZones[laneIndex] = true;
            return newZones;
        });

        // Deactivate hit zone after a short delay
        setTimeout(() => {
            setActiveZones(zones => {
                const newZones = [...zones];
                newZones[laneIndex] = false;
                return newZones;
            });
        }, 100); // Change this value to adjust how long the hit zone stays active
    };

    useEffect(() => {
        const keyHandler = (e) => {
            if (gameStarted) {
                switch (e.key) {
                    case 'a':
                        handleKeyPress(0);
                        break;
                    case 's':
                        handleKeyPress(1);
                        break;
                    case 'j':
                        handleKeyPress(2);
                        break;
                    case 'k':
                        handleKeyPress(3);
                        break;
                    case 'l':
                        handleKeyPress(4);
                        break;
                    default:
                        break;
                }
            }
        };

        window.addEventListener('keydown', keyHandler);
        return () => {
            window.removeEventListener('keydown', keyHandler);
        };
    }, [gameStarted]);

    return (
        <div className='gameplay'>
                {!gameStarted && (
                    <div className='start-game-modal'>
                        <button onClick={handleStartGame}>Start Track</button>
                    </div>
                )}
            {/* <audio ref={audioRef} src={track?.song?.audio_url} preload="auto" /> */}
            <div className='left'>
                <i className="fa-solid fa-chevron-left"></i>
                <div className='multiplier'>

                </div>
            </div>
            <div className='center'>
                <div className='track-lanes'>
                    {[...Array(5)].map((_, laneIndex) => (
                        <div className='lanes' key={laneIndex}>
                            {fallingNotes.filter(note => note.lane === laneIndex).map(note => (
                                <div className={`note ${hitNotes.has(note.uniqueId) ? 'hit' : ''}`} key={note.uniqueId} style={{ top: `${note.position}%` }}></div>
                            ))}
                            <div className={`hit-zone ${activeZones[laneIndex] ? 'active' : ''}`}></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='right'>
                <div className='score'>

                </div>
            </div>
        </div>
    )
}

export default Gameplay;
