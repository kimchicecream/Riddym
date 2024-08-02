import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchTracks } from '../../redux/tracks';

import "./Browse.css";

function Browse() {
    const dispatch = useDispatch();
    const tracks = useSelector(state => state.tracks.allTracks);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTrack, setSelectedTrack] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
          document.body.style.overflow = "auto";
        };
    }, []);

    const filteredTracks = Object.values(tracks).filter(track =>
        track.song.song_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.song.artist_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        dispatch(fetchTracks())
    }, [dispatch])

    useEffect(() => {
    }, [tracks]);

    const formatDuration = (duration) => {
        const roundedDuration = Math.floor(duration);
        const minutes = Math.floor(roundedDuration / 60);
        const seconds = roundedDuration % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleTrackClick = (track) => {
        setSelectedTrack(track);
    };

    const handlePlay = (e) => {
        e.preventDefault();
        if (selectedTrack) {
            navigate(`/play/${selectedTrack.id}`);
        }
    };

    return (
        <div className="browse-page">
            <div className="track-list">
                <div className='search-bar'>
                    <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type='text'
                            placeholder='Search tracks by name'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                </div>
                <div className='tracks'>
                    {filteredTracks.reverse().map(track => (
                        <div
                            key={track.id}
                            className={`track-card ${selectedTrack && selectedTrack.id === track.id ? 'selected' : ''}`}
                            onClick={() => handleTrackClick(track)}
                        >
                            <img src={track.song?.image_url} alt={track.song?.song_name} />
                            <div className='track-details'>
                                <h4><span>{track.song?.song_name}</span></h4>
                                <p><i className="fa-regular fa-clock"></i> {formatDuration(track.duration)}</p>
                                <p><i className="fa-brands fa-itunes-note"></i> {Object.values(track.notes).length}</p>
                                {/* <p>By: {track.creator.username}</p> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="selected-track">
                {selectedTrack && (
                    <div className='track-info'>
                        <h1>{selectedTrack.song?.song_name}</h1>
                        <div className='scores'>
                            <h2>Scores</h2>
                        </div>
                        <div className='play'>
                            <button className='play-button' onClick={handlePlay}>Play Track</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse;
