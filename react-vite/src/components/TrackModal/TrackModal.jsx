import { useNavigate } from 'react-router-dom';
import './TrackModal.css';
import OpenModalButton from '../OpenModalButton';
import ConfirmDelete from '../ConfirmDelete';
import { useModal } from "../../context/Modal";

function TrackModal({ track }) {
    // const [activeTab, setActiveTab] = useState('global');
    const navigate = useNavigate();
    const { closeModal } = useModal();

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // const handleTabChange = (tab) => {
    //     setActiveTab(tab);
    // };

    const handlePlay = async (e) => {
        e.preventDefault();
        navigate(`/play/${track.id}`);
        closeModal();
    }

    const handleEdit = (e) => {
        e.preventDefault();
        navigate(`/track-creator/edit/${track.id}`);
        closeModal();
    };

    if (!track) {
        return null
    }

    const { song, notes } = track;
    const noteCount = notes ? Object.keys(notes).length : 0;

    return (
        <div className='track-modal-container'>
            <div className='song-details'>
                <div className='song-image'>
                    <img src={song?.image_url} />
                </div>
                <div className='song-info'>
                    <h2>{song?.song_name}</h2>
                    <h3>{song?.artist_name}</h3>
                    <h4>{formatDuration(track.duration)}</h4>
                    <p>{noteCount} {noteCount === 1 ? 'note' : 'notes'}</p>
                </div>
                <div className='buttons-container'>
                    <button className='play-button' onClick={handlePlay}>Play</button>
                    <div className='update-delete'>
                        <button className="update-button" onClick={handleEdit}>Edit</button>
                        <OpenModalButton
                            buttonText="Delete"
                            modalComponent={<ConfirmDelete track={track} />}
                            className="delete-button"
                        />
                    </div>
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

export default TrackModal;
