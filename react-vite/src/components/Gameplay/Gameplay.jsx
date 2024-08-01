import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrackById } from '../../redux/tracks';
import { thunkAuthenticate } from '../../redux/session';
import './Gameplay.css';

function Gameplay() {
    const { trackId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const track = useSelector(state => state.tracks.allTracks[trackId]);
    const sessionUser = useSelector((state) => state.session.user);
    const [totalNotes, setTotalNotes] = useState(0);
    const [fallingNotes, setFallingNotes] = useState([]);
    const [activeZones, setActiveZones] = useState([false, false, false, false, false]);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [gameEnding, setGameEnding] = useState(false);
    const [hitNotes, setHitNotes] = useState(new Set());
    const [score, setScore] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [missedNotes, setMissedNotes] = useState(new Set());
    // const [processedNotes, setProcessedNotes] = useState(0);
    const waveSurferRef = useRef(null);
    const startTimeRef = useRef(null);
    const lastNoteRef = useRef(false);

    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [highestMultiplier, setHighestMultiplier] = useState(1);

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

    useEffect(() => {
        if (!sessionUser) {
            dispatch(thunkAuthenticate());
        }
    }, [dispatch, sessionUser]);

    // the song
    useEffect(() => {
        if (track && track.song && track.song.song_url && !waveSurferRef.current) {
            waveSurferRef.current = WaveSurfer.create({
                container: document.createElement('div'), // dummy element
                height: 0,
                normalize: true,
            });

            waveSurferRef.current.load(track.song.song_url);

            // error handling for loading audio
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
            const notes = Object.values(track.notes).map(note => ({
                ...note,
                uniqueId: `${note.id}-${Date.now()}-${Math.random()}`,
                missed: false // Add missed property
            }));
            setFallingNotes(notes);
            setTotalNotes(notes.length);
            console.log("Falling notes initialized:", notes);

            // identify the last note
            const lastNote = notes.reduce((prev, current) => (prev.time > current.time) ? prev : current);
            lastNoteRef.current = lastNote;
            console.log("Last note identified:", lastNote);

            requestAnimationFrame(updateNotesPosition);
        }
    }, [gameStarted, track]);

    const updateNotesPosition = () => {
        if (gameEnding) return;

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

            const hitZoneBottom = HIT_ZONE_POSITION + HIT_ZONE_HEIGHT;

            updatedNotes.forEach(note => {
                if (note.position > hitZoneBottom && !hitNotes.has(note.uniqueId) && !note.missed) {
                    // console.log(`Note went off screen without being hit: ${note.uniqueId}`);
                    note.missed = true;
                    setMissedNotes(prevMissedNotes => {
                        const newMissedNotes = new Set(prevMissedNotes);
                        newMissedNotes.add(note.uniqueId);
                        return newMissedNotes;
                    });
                    setMultiplier(1); // reset multiplier on miss
                    setCurrentStreak(0); // reset current streak on miss
                    console.log(`Note missed: ${note.uniqueId}`);
                }
            });

            updatedNotes.forEach(note => {
                if (note.position > 100 && !hitNotes.has(note.uniqueId) && !note.missed) {
                    console.log(`Note went off screen without being hit: ${note.uniqueId}`);
                    note.missed = true;
                    setMissedNotes(prevMissedNotes => {
                        const newMissedNotes = new Set(prevMissedNotes);
                        newMissedNotes.add(note.uniqueId);
                        return newMissedNotes;
                    });
                    setMultiplier(1);
                    setCurrentStreak(0);
                }
            });

            if (!gameEnding && (updatedNotes.length === 0 || (updatedNotes[0].uniqueId === lastNoteRef.current.uniqueId && updatedNotes[0].position > 100))) {
                console.log('Last note processed. Ending game.');
                setGameEnding(true);
                endGame();
            }

            return updatedNotes.filter(note => note.position <= 100);
        });

        if (gameStarted) {
            requestAnimationFrame(updateNotesPosition);
        }
    };

    // useEffect(() => {
    //     const totalNotes = Object.values(track?.notes || {}).length;
    //     if (processedNotes === totalNotes && gameStarted) {
    //         console.log('All notes processed. Ending game.');
    //         endGame();
    //     }
    // }, [processedNotes, gameStarted, track?.notes]);

    const endGame = () => {
        if (gameEnding) return; // prevent multiple calls (doesnt work)
        console.log('Triggering endGame');
        setGameEnding(true);
        setTimeout(() => {
            if (waveSurferRef.current) {
                fadeOutAudio(waveSurferRef.current, 2000); // 2 seconds fade out
            }
            setTimeout(() => {
                setGameEnded(true);
                console.log('Game ended');
            }, 2000); // show game over overlay after the fade-out
        }, 2000); // delay before starting the fade-out
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
            setHitNotes(prevHitNotes => {
                const newHitNotes = new Set(prevHitNotes);
                newHitNotes.add(hitNote.uniqueId);
                return newHitNotes;
            });
            setScore(prevScore => prevScore + 150 * multiplier);
            setMultiplier(prevMultiplier => {
                const newMultiplier = prevMultiplier + 1;
                if (newMultiplier > highestMultiplier) {
                    setHighestMultiplier(newMultiplier);
                }
                return newMultiplier;
            });
            setCurrentStreak(prevStreak => {
                const newStreak = prevStreak + 1;
                if (newStreak > longestStreak) {
                    setLongestStreak(newStreak);
                }
                return newStreak;
            });
            console.log(`Hit note in lane ${laneIndex + 1}`);
            setFallingNotes(prevNotes => {
                const updatedNotes = prevNotes.filter(note => note.uniqueId !== hitNote.uniqueId);
                console.log('Updated falling notes after hit:', updatedNotes); // logging updated notes
                return updatedNotes;
            });
        } else {
            console.log(`Lane key pressed at ${laneIndex + 1}`);
            setMultiplier(1); // reset multiplier on miss
            setCurrentStreak(0); // reset current streak on miss
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

    // useEffect to end game properly
    const fadeOutAudio = (waveSurfer, duration = 2000) => {
        const fadeOutInterval = 50;
        const steps = duration / fadeOutInterval;
        const volumeStep = waveSurfer.getVolume() / steps;

        const fadeAudio = setInterval(() => {
            const currentVolume = waveSurfer.getVolume();
            if (currentVolume <= volumeStep) {
                clearInterval(fadeAudio);
                waveSurfer.setVolume(0);
            } else {
                waveSurfer.setVolume(currentVolume - volumeStep);
            }
        }, fadeOutInterval);
    };

    const handleBack = async () => {
        if (!sessionUser) {
            console.error('Session user is not defined.');
            return;
        }
        navigate(`/session-overview/${sessionUser.username}`);
    }

    const handleEnd = async () => {
        navigate(`/session-overview/${sessionUser.username}`);
    }

    return (
        <div className='gameplay'>
                {!gameStarted && !gameEnded && (
                    <div className='start-game-modal'>
                        <button className="start-track" onClick={handleStartGame}>Start Track</button>
                        <button className="back" onClick={handleBack}><i className="fa-solid fa-angle-left"></i>Back to Overview</button>
                    </div>
                )}
                {gameEnded && (
                    <div className='end-game-modal'>
                        <div className='container'>
                            <h1>Game Over</h1>
                            <div className='score'>
                                <h2>{score}</h2>
                            </div>
                            <div className='hit'>
                                <p>Notes Hit</p> <p>{hitNotes.size} / {totalNotes}</p>
                            </div>
                            <div className='missed'>
                            <p>Notes Missed</p> <p>{totalNotes - hitNotes.size}</p>
                            </div>
                            <div className='streak'>
                                <p>Longest Streak</p> <p>{longestStreak}</p>
                            </div>
                            <div className='highest-multi'>
                                <p>Highest Multiplier</p> <p>x{highestMultiplier}</p>
                            </div>
                            <button className="back" onClick={handleBack}><i className="fa-solid fa-angle-left"></i>Back to Overview</button>
                        </div>
                    </div>
                )}
            {/* <audio ref={audioRef} src={track?.song?.audio_url} preload="auto" /> */}
            <div className='left'>
                <i onClick={handleEnd} className="fa-solid fa-chevron-left"></i>
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
                    <div className='falling-line'></div>
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
