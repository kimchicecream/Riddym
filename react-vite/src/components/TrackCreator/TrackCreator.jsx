import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.esm.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import { createNote, editNote, removeNote, /* updateTrackIdThunk */ } from '../../redux/notes';
import { createTrack, fetchTrackById, editTrack, clearTrackNotes, setTrackNotes } from '../../redux/tracks';
// import { v4 as uuidv4 } from 'uuid';
import './TrackCreator.css';

function TrackCreator() {
    const { songId, trackId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notes = useSelector(state => state.notes.trackNotes);
    // const track = useSelector(state => state.tracks.userTracks[trackId]);
    const [song, setSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [draggedNoteId, setDraggedNoteId] = useState(null);
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null)
    const timelineRef = useRef(null);
    const lanesRef = useRef(null);
    const minPxPerSec = 300;
    const snapThreshold = 0.08;
    // const [tempTrackId] = useState(uuidv4());
    const [isEditMode, setIsEditMode] = useState(false);

    // keep page static
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
          document.body.style.overflow = "auto";
        };
    }, []);

    // fetch song
    useEffect(() => {
        const controller = new AbortController(); // helps prevent memory leaks
        const signal = controller.signal;

        const fetchSong = async (id) => {
            try {
                const response = await fetch(`/api/songs/${id}`, { signal });
                if (response.ok) {
                    const data = await response.json();
                    setSong(data);
                } else {
                    console.error('Failed to fetch song details');
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error fetching song details:', error);
                }
            }
        };

        if (trackId) {
            dispatch(fetchTrackById(trackId)).then((trackData) => {
                setIsEditMode(true);
                if (trackData && trackData.song) {
                    const songDetails = trackData.song;
                    setSong(songDetails);
                    // Set track notes into state as an array
                    dispatch(setTrackNotes(Object.values(trackData.notes)));
                } else {
                    console.error('Failed to get song details from track data');
                }
            });
        } else {
            dispatch(clearTrackNotes());
            fetchSong(songId);
        }

        return () => {
            controller.abort();
        };
    }, [songId, trackId, dispatch]);

    // ****** wavesurfer ******
    useEffect(() => {
        if (song && waveformRef.current && !wavesurferRef.current) {
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#d9dcff',
                progressColor: '#29DFB1',
                height: 230,
                responsive: true,
                normalize: true,
                scrollParent: true,
                minPxPerSec: minPxPerSec,
                cursorWidth: 2,
                barWidth: 2,
                barGap: 1.5,
                plugins: [
                    TimelinePlugin.create({
                        container: timelineRef.current
                    }),
                    HoverPlugin.create(),
                    Minimap.create({
                        height: 150,
                        waveColor: '#d9dcff',
                        progressColor: '#4353ff',
                        cursorColor: '#ff6347',
                        cursorWidth: 2,
                        barWidth: 2,
                        barGap: 1.5,
                    })
                ]
            });

            wavesurferRef.current.load(song.song_url);

            wavesurferRef.current.on('ready', () => {
                console.log('WaveSurfer is ready');
                const duration = wavesurferRef.current.getDuration();
                setDuration(duration);
                const newWidth = duration * minPxPerSec;
                waveformRef.current.style.width = `${newWidth}px`;
                lanesRef.current.style.width = `${newWidth}px`;
                document.querySelectorAll('.lane').forEach(lane => {
                    lane.style.width = `${newWidth}px`;
                });
            });

            wavesurferRef.current.on('audioprocess', () => {
                setCurrentTime(wavesurferRef.current.getCurrentTime());
            });

            wavesurferRef.current.on('seek', (progress) => {
                const newTime = wavesurferRef.current.getDuration() * progress;
                setCurrentTime(newTime);
            });

            wavesurferRef.current.on('error', (e) => {
                console.error('WaveSurfer error:', e); // Log errors properly
            });

            wavesurferRef.current.on('finish', () => {
                setIsPlaying(false);
            });
        }
    }, [song]);

    // play button
    const handlePlay = useCallback(() => {
        if (wavesurferRef.current && !isPlaying) {
            wavesurferRef.current.play();
            setIsPlaying(true);
        }
    }, [isPlaying]);

    // pause button
    const handlePause = useCallback(() => {
        if (wavesurferRef.current && isPlaying) {
            wavesurferRef.current.pause();
            setIsPlaying(false);
        }
    }, [isPlaying]);

    // play from beginning button
    const handleRestart = () => {
        if (wavesurferRef.current) {
            wavesurferRef.current.seekTo(0);
            if (!isPlaying) {
                wavesurferRef.current.pause();
            }
            setIsPlaying(true);
        }
    };

    // use spacebar to pause and play
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                if (isPlaying) {
                    handlePause();
                } else {
                    handlePlay();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handlePlay, isPlaying, handlePause]);

    // format timestamp
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const milliseconds = Math.floor((time % 1) * 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds < 100 ? (milliseconds < 10 ? '00' : '0') : ''}${milliseconds}`;
    };

    // width of lanes
    useEffect(() => {
        if (lanesRef.current) {
            const newWidth = duration * minPxPerSec;
            lanesRef.current.style.width = `${newWidth}px`;
            document.querySelectorAll('.lane').forEach(lane => {
                lane.style.width = `${newWidth}px`;
            });
        }
    }, [duration]);

    const handleDragStart = (e, noteId) => {
        console.log(`Dragging note with ID: ${noteId}`);
        e.dataTransfer.setData('note-id', noteId);
        setDraggedNoteId(noteId);
    };

    // actions for where the note is dropped
    const handleDrop = async (e, laneNumber) => {
        e.preventDefault();
        const noteId = e.dataTransfer.getData('note-id');
        let timestamp = (e.clientX - e.target.getBoundingClientRect().left) / minPxPerSec;

        for (let i = 1; i <= 5; i++) {
            if (i !== laneNumber) {
                const adjacentNotes = Object.values(notes).filter((note) => note.lane === i);
                for (let note of adjacentNotes) {
                    if (Math.abs(note.time - timestamp) < snapThreshold) {
                        timestamp = note.time;
                        break;
                    }
                }
            }
        }

        if (noteId === 'new') {
            const newNote = {
                time: timestamp,
                lane: laneNumber,
                note_type: 'tap',
            };

            dispatch(createNote(newNote));
        } else {
            const existingNote = notes[noteId];
            const updatedNote = {
                ...existingNote,
                time: timestamp,
                lane: laneNumber,
            };

            dispatch(editNote(noteId, updatedNote));
        }
        setDraggedNoteId(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // recognizes when a note is dragged outside the lanes
    const handleDragEnd = (e) => {
        const lanesBoundingBox = lanesRef.current.getBoundingClientRect();
        if (e.clientY < lanesBoundingBox.top || e.clientY > lanesBoundingBox.bottom) {
            // If the drag ends outside the lanes container, remove the note
            if (draggedNoteId && draggedNoteId !== 'new') {
                console.log(`Removing note with ID: ${draggedNoteId}`);
                dispatch(removeNote(draggedNoteId));
                setDraggedNoteId(null);
            }
        }
    };

    // format to mm:ss
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // when publish-button is clicked
    const handlePublish = async () => {
        const trackData = {
            song_id: songId,
            notes: Object.values(notes),
            duration: duration,
        };

        if (isEditMode) {
            const result = await dispatch(editTrack(trackId, trackData));
            if (result.errors) {
                console.error('Errors:', result.errors);
            } else {
                navigate(`/track-overview/${trackId}`);
            }
        } else {
            const result = await dispatch(createTrack(trackData));
            if (result.errors) {
                console.error('Errors:', result.errors);
            } else {
                navigate(`/track-overview/${result.id}`);
            }
        }
    };

    const handleHome = async () => {
        navigate('/');
    }

    if (!song) {
        return <div>Loading song details...</div>;
    }

    return (
        <div className='track-creator-page'>
            <div className='nav-bar'>
                    <button onClick={handleHome}>Home</button>
                    <button onClick={handlePublish}>{isEditMode ? 'Confirm Changes' : 'Publish'}</button>
            </div>
            <div className='track-creator'>
                <div className='song-details-container'>
                    <div className='song-image'>
                        <img src={song.image_url} />
                    </div>
                    <div className='song-details'>
                        <h2>{song.song_name}</h2>
                        <h3>{song.artist_name}</h3>
                        <p>{formatDuration(song.duration)}</p>
                    </div>
                </div>
                <div className='controls'>
                    <div className='note-container'>
                        <div className='note' draggable onDragStart={(e) => handleDragStart(e, 'new')}></div>
                    </div>
                    <div className='play-pause'>
                        <button onClick={handleRestart}>
                            <i className="fa-solid fa-undo"></i>
                        </button>
                        <button onClick={handlePlay} disabled={isPlaying}>
                            <i className="fa-solid fa-play"></i>
                        </button>
                        <button onClick={handlePause} disabled={!isPlaying}>
                            <i className="fa-solid fa-pause"></i>
                        </button>
                    </div>
                    <div className='timestamp'>
                        <p>{formatTime(currentTime)}</p>
                    </div>
                    <p>{Object.keys(notes).length} note{Object.keys(notes).length !== 1 ? 's' : ''}</p>
                </div>
                <div className='wavesurfer-track'>
                    <div ref={waveformRef} id="waveform"></div>
                    <div className='track-lanes' ref={lanesRef}>
                        {[1, 2, 3, 4, 5].map(lane => (
                            <div
                                key={lane}
                                className='lane'
                                id={`lane-${lane}`}
                                onDrop={(e) => handleDrop(e, lane)}
                                onDragOver={handleDragOver}
                            >
                                {Object.values(notes).filter(note => note.lane === lane).map(note => (
                                    <div
                                        key={note.id}
                                        className='note'
                                        style={{ left: `${note.time * minPxPerSec}px` }}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, note.id)}
                                        onDragEnd={handleDragEnd}
                                    ></div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default TrackCreator;
