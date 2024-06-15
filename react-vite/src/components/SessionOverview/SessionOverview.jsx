import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTracksByUser } from '../../redux/tracks';
import { fetchSongsByUser } from '../../redux/songs';
import OpenModalButton from "../OpenModalButton";
import TrackModal from '../TrackModal';
import './SessionOverview.css';

function SessionOverview() {
    const { username } = useParams();
    const dispatch = useDispatch();
    const songs = useSelector(state => state.songs.userSongs);
    const tracks = useSelector(state => state.tracks.userTracks);
    const userId = useSelector(state => state.session.user.id);

    useEffect(() => {
        if (userId) {
          dispatch(fetchTracksByUser(userId));
          dispatch(fetchSongsByUser(userId));
        }
    }, [dispatch, userId]);

    const formatDuration = (duration) => {
        const roundedDuration = Math.floor(duration);
        const minutes = Math.floor(roundedDuration / 60);
        const seconds = roundedDuration % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className='session-overview-page'>
            <h1>Welcome, {username}</h1>
            <div className='song-tracks'>
                <div className='your-songs'>
                    <h3>Your Songs</h3>
                    <div className='song-card-container'>
                        {Object.values(songs).map(song => (
                            <div className='song-card' key={song.id}>
                                <img src={song.image_url} />
                                <div className='song-details'>
                                    <h4>{song.song_name}</h4>
                                    <p>{song.artist_name}</p>
                                    <p>{formatDuration(song.duration)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='your-tracks'>
                    <h3>Your Tracks</h3>
                    <div className='track-card-container'>
                        {Object.values(tracks).map(track => (
                            <OpenModalButton
                                key={track.id}
                                buttonText={
                                    <div className='track-card'>
                                        <div className='track-image'>
                                            <img src={track.song?.image_url} alt={track.song?.song_name} />
                                        </div>
                                        <div className='track-details'>
                                            <h4>{track.song?.song_name}</h4>
                                            <p>{formatDuration(track.duration)}</p>
                                            <p>{Object.values(track.notes).length} {Object.values(track.notes).length === 1 ? 'note' : 'notes'}</p>
                                        </div>
                                    </div>
                                }
                                modalComponent={<TrackModal track={track} />}
                                className='track-open-modal'
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SessionOverview;
