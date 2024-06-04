import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrackById } from '../../redux/tracks';
import './TrackOverview.css';

function TrackOverview() {
    const { trackId } = useParams();
    const dispatch = useDispatch();
    const track = useSelector(state => state.tracks.userTracks[trackId]);

    // fetch the track created
    useEffect(() => {
        if (trackId) {
            dispatch(fetchTrackById(trackId));
        }
    }, [dispatch, trackId]);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    if (!track) {
        return <div>Loading track details...</div>;
    }

    return (
        <div className='track-overview-page'>
            <h1>Your track is now available to play.</h1>
            <div className='track-details'>
                <div className='song-image'>
                    <img src={track.song?.image_url} />
                </div>
                <div className='song-details'>
                    <h2>{track.song?.song_name}</h2>
                    <h3>{track.song?.artist_name}</h3>
                    <p>{formatDuration(track.duration)}</p>
                    <p>{track.notes?.length} notes</p>
                </div>
            </div>
        </div>
    )
}

export default TrackOverview;
