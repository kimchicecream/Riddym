import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTracksByUser } from '../../redux/tracks';
import { fetchSongsByUser } from '../../redux/songs';
import OpenModalButton from "../OpenModalButton";
import ConfirmSongDelete from '../ConfirmSongDelete/ConfirmSongDelete';
import TrackModal from '../TrackModal';
import EditSongModal from '../EditSongModal/EditSongModal';
import './SessionOverview.css';

function SessionOverview() {
    const { username } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    const handleAddSongClick = () => {
        navigate('/add-song');
    };

    return (
        <div className='session-overview-page'>
            <h1>Welcome, {username}</h1>
            <div className='song-tracks'>
                <div className='your-songs'>
                    <h3>Your Songs</h3>
                    <div className='song-card-container'>
                        <div className='add-song-button' onClick={handleAddSongClick}>
                            <i className="fa-solid fa-plus"></i>
                            <span className='tooltip'>Add a new song</span>
                        </div>
                        {Object.values(songs).reverse().map(song => (
                            <div className='song-card' key={song.id}>
                                <div className='song-info'>
                                    <img src={song.image_url} />
                                    <div className='song-details'>
                                        <h4><span>{song.song_name}</span></h4>
                                        <p><span>{song.artist_name}</span></p>
                                        <p>{formatDuration(song.duration)}</p>
                                    </div>
                                </div>
                                <div className='buttons'>
                                    <OpenModalButton
                                        buttonText={<i className="fa-solid fa-pen-to-square"></i>}
                                        modalComponent={<EditSongModal song={song} />}
                                        className="edit-button"
                                    />
                                    <OpenModalButton
                                        buttonText={<i className="fa-solid fa-trash-can"></i>}
                                        modalComponent={<ConfirmSongDelete song={song} />}
                                        className="delete-button"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='your-tracks'>
                    <h3>Your Tracks</h3>
                    <div className='track-card-container'>
                        <div className='add-song-button' onClick={handleAddSongClick}>
                            <i className="fa-solid fa-plus"></i>
                            <span className='tooltip'>Make a new track</span>
                        </div>
                        {Object.values(tracks).reverse().map(track => (
                            <OpenModalButton
                                key={track.id}
                                buttonText={
                                    <div className='track-card'>
                                        <div className='track-image'>
                                            <img src={track.song?.image_url} alt={track.song?.song_name} />
                                        </div>
                                        <div className='track-details'>
                                            <h4><span>{track.song?.song_name}</span></h4>
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
