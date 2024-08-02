import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchTracks } from '../../redux/tracks';

import "./Browse.css";

function Browse() {
    const dispatch = useDispatch();
    const tracks = useSelector(state => state.tracks.allTracks);
    const [searchQuery, setSearchQuery] = useState('');

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

    return (
        <div className="browse-page">
            <div className="track-list">
                <div className='search-bar'>
                    <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type='text'
                            placeholder='Search tracks by song name or artist'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                </div>
                <div className='tracks'>
                    {filteredTracks.reverse().map(track => (
                        <div className='track-card' key={track.id}>
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

            </div>
        </div>
    )
}

export default Browse;
