import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrackById } from '../../redux/tracks';
import './TrackOverview.css';
import OpenModalButton from '../OpenModalButton';
import TrackPreviewModal from '../TrackPreviewModal';

function TrackOverview() {
    const { trackId } = useParams();
    const dispatch = useDispatch();
    const track = useSelector(state => state.tracks.userTracks[trackId]);
    const sessionUser = useSelector((state) => state.session.user);
    const navigate = useNavigate();

    // fetch the track created
    useEffect(() => {
        if (trackId) {
            dispatch(fetchTrackById(trackId));
        }
    }, [dispatch, trackId]);

    useEffect(() => {
        if (track) {
            console.log("Track data:", track);
            console.log("Notes data type:", typeof track.notes);
            console.log("Notes data:", track.notes);
        }
    }, [track]);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    if (!track) {
        return <div>Loading track details...</div>;
    }

    const handleRedirect = async () => {
        if (!sessionUser) {
            console.error('Session user is not defined.');
            return;
        }
        navigate(`/session-overview/${sessionUser.username}`);
    }

    const { song, notes } = track;
    const noteCount = notes ? Object.keys(notes).length : 0;

    return (
        <div className='track-overview-page'>
            <h1>Your track is now available to play.</h1>
            <div className='track-details'>
                <div className='song-image'>
                    <img src={song?.image_url} />
                </div>
                <div className='song-details'>
                    <h2>{song?.song_name}</h2>
                    <h3>{song?.artist_name}</h3>
                    <h4>{formatDuration(track.duration)}</h4>
                    <p>{noteCount} {noteCount === 1 ? 'note' : 'notes'}</p>
                </div>
            </div>
            <div className='buttons-container'>
                <button onClick={handleRedirect} className='overview-button'>Account Overview</button>
                <OpenModalButton
                    buttonText='Play'
                    modalComponent={<TrackPreviewModal />}
                    className="play-button"
                />
            </div>
        </div>
    )
}

export default TrackOverview;
