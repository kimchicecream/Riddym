import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrackById } from '../../redux/tracks';
import './Gameplay.css';

function Gameplay() {
    const { trackId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const track = useSelector(state => state.tracks.allTracks[trackId]);
    const sessionUser = useSelector((state) => state.session.user);
    const [fallingNotes, setFallingNotes] = useState([]);
    const [activeZones, setActiveZones] = useState([false, false, false, false, false]);
    const [gameStarted, setGameStarted] = useState(false);
    const [hitNotes, setHitNotes] = useState(new Set());
    const [score, setScore] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [missedNotes, setMissedNotes] = useState(new Set());
    const waveSurferRef = useRef(null);
    const startTimeRef = useRef(null);

    const HIT_ZONE_POSITION = 90; // 90% from the top
    const HIT_ZONE_HEIGHT = 30; // height of the hit zone
    const NOTE_HEIGHT = 30; // height of a note
    const HIT_OFFSET = 25; // amount of note that must be above the hit zone to count as a hit

    const KEY_LABELS = ['A', 'S', 'J', 'K', 'L'];

    // keep page static
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
          document.body.style.overflow = "auto";
        };
    }, []);

    // get all track info
    useEffect(() => {
        if (trackId) {
            dispatch(fetchTrackById(trackId));
        }
    }, [dispatch, trackId]);

    // the song
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

        return () => {
            if (waveSurferRef.current) {
                waveSurferRef.current.stop();
                waveSurferRef.current.destroy();
                waveSurferRef.current = null;
            }
        };
    }, [track]);

    // the notes & when they start falling
    useEffect(() => {
        if (gameStarted && track && track.notes) {
            const startTime = Date.now();
            startTimeRef.current = startTime + 1070;
            setFallingNotes(Object.values(track.notes).map(note => ({
                ...note,
                uniqueId: `${note.id}-${Date.now()}-${Math.random()}`
            })));
            console.log("Falling notes initialized:", Object.values(track.notes));
            requestAnimationFrame(updateNotesPosition);
        }
    }, [gameStarted, track]);

    const updateNotesPosition = () => {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTimeRef.current) / 1000; // in seconds

        setFallingNotes(prevNotes => {
            if (!Array.isArray(prevNotes)) {
                console.error("prevNotes is not an array:", prevNotes);
                return prevNotes; // return early if prevNotes is not an array
            }

            const updatedNotes = prevNotes.map(note => ({
                ...note,
                position: (elapsedTime - note.time) * 100
            }));

            const hitZoneBottom = HIT_ZONE_POSITION;
            updatedNotes.forEach(note => {
                if (note.position > hitZoneBottom + HIT_ZONE_HEIGHT && !hitNotes.has(note.uniqueId) && !missedNotes.has(note.uniqueId)) {
                    setMissedNotes(prevMissedNotes => new Set(prevMissedNotes).add(note.uniqueId));
                }
            });

            return updatedNotes;
        });

        if (gameStarted) {
            requestAnimationFrame(updateNotesPosition);
        }
    };

    const handleStartGame = async () => {
        setGameStarted(true);
        startTimeRef.current = Date.now();
        setTimeout(() => {
            waveSurferRef.current.play();
        }, 2000); // 2 second buffer
    };

    const handleKeyPress = (laneIndex) => {
        const hitZoneTop = HIT_ZONE_POSITION;
        const hitZoneBottom = HIT_ZONE_POSITION + HIT_ZONE_HEIGHT;
        const hitNote = fallingNotes.find(note =>
            note.lane === laneIndex + 1 &&
            note.position + NOTE_HEIGHT >= hitZoneTop + HIT_OFFSET &&
            note.position <= hitZoneBottom &&
            !hitNotes.has(note.uniqueId)
        );

        if (hitNote) {
            setHitNotes(prevHitNotes => new Set(prevHitNotes).add(hitNote.uniqueId));
            setScore(prevScore => prevScore + 300 * multiplier);
            setMultiplier(prevMultiplier => prevMultiplier + 1);
            console.log(`Hit note in lane ${laneIndex + 1}`);
            setFallingNotes(prevNotes => {
                const updatedNotes = prevNotes.filter(note => note.uniqueId !== hitNote.uniqueId);
                console.log('Updated falling notes after hit:', updatedNotes); // logging updated notes
                return updatedNotes;
            });
        } else {
            console.log(`Missed note in lane ${laneIndex + 1}`);
            setMultiplier(1); // reset multiplier on miss
        }

        // Activate hit zone
        setActiveZones(zones => {
            const newZones = [...zones];
            newZones[laneIndex] = true;
            return newZones;
        });

        // deactivate hit zone after a short delay
        setTimeout(() => {
            setActiveZones(zones => {
                const newZones = [...zones];
                newZones[laneIndex] = false;
                return newZones;
            });
        }, 100); // value to adjust how long the hit zone stays active
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
    }, [gameStarted, fallingNotes, hitNotes, multiplier]);

    const handleBack = async () => {
        if (!sessionUser) {
            console.error('Session user is not defined.');
            return;
        }
        navigate(`/session-overview/${sessionUser.username}`);
    }

    return (
        <div className='gameplay'>
                {!gameStarted && (
                    <div className='start-game-modal'>
                        <button className="start-track" onClick={handleStartGame}>Start</button>
                        <button className="back" onClick={handleBack}><i className="fa-solid fa-angle-left"></i>Back to Overview</button>
                    </div>
                )}
            {/* <audio ref={audioRef} src={track?.song?.audio_url} preload="auto" /> */}
            <div className='left'>
                <i className="fa-solid fa-chevron-left"></i>
                <div className='multiplier'>
                    Multiplier: x{multiplier}
                </div>
            </div>
            <div className='center'>
                <div className='track-lanes'>
                    {[...Array(5)].map((_, laneIndex) => (
                        <div className='lanes' key={laneIndex}>
                            {fallingNotes.filter(note => note.lane === laneIndex + 1).map(note => (
                                <div
                                    className={`note ${hitNotes.has(note.uniqueId) ? 'hit' : missedNotes.has(note.uniqueId) ? 'missed' : ''}`}
                                    key={note.uniqueId}
                                    style={{ top: `${note.position}%` }}
                                ></div>
                            ))}
                            <div className={`hit-zone ${activeZones[laneIndex] ? 'active' : ''}`}></div>
                            <div className="key-label">{KEY_LABELS[laneIndex]}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='right'>
                <div className='score'>
                    Score: {score}
                </div>
            </div>
        </div>
    )
}

export default Gameplay;
