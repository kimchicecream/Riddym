import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './TrackPreviewModal.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrackById } from '../../redux/tracks';

function TrackPreviewModal() {
    const { trackId } = useParams();
    const dispatch = useDispatch();
    const track = useSelector(state => state.tracks.userTracks[trackId]);
    const [activeTab, setActiveTab] = useState('global');
    const navigate = useNavigate();

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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const { song, notes } = track;
    const noteCount = notes ? Object.keys(notes).length : 0;

    const handlePlay = async (e) => {
        e.preventDefault();

        navigate(`/play/${trackId}`)
    }

    return (
        <div className='track-preview-modal'>
            <div className='song-details'>
                <div className='song-image'>
                    <img src={song?.image_url} />
                </div>
                <div className='song-info'>
                    <h2>{song?.song_name}</h2>
                    <h3>{song?.artist_name}</h3>
                    <h4>{formatDuration(track.duration)}</h4>
                    <p>{noteCount / 2} {noteCount === 1 ? 'note' : 'notes'}</p>
                </div>
                <div className='buttons-container'>
                    <button className='play-button' onClick={handlePlay}>Play</button>
                </div>
            </div>
            <div id='divider'></div>
            <div className='scoreboard'>
                <div className='tabs'>
                    {/* <button
                        className={activeTab === 'global' ? 'active' : ''}
                        onClick={() => handleTabChange('global')}
                    >
                        Global
                    </button>
                    <button
                        className={activeTab === 'friends' ? 'active' : ''}
                        onClick={() => handleTabChange('friends')}
                    >
                        Friends
                    </button> */}
                </div>
                <div className='tab-content'>
                    {/* {activeTab === 'global' ? (
                        <div className='global'>
                            Render global high scores
                        </div>
                    ) : (
                        <div className='friends'>
                            Render friends' high scores
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    )
}

export default TrackPreviewModal;
