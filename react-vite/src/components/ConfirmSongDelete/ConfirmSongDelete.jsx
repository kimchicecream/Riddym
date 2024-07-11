import './ConfirmSongDelete.css';

import { useDispatch } from 'react-redux';
import { removeSong, fetchSongsByUser } from '../../redux/songs';
import { useModal } from "../../context/Modal";

function ConfirmSongDelete({ song }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async () => {
        await dispatch(removeSong(song.id));
        dispatch(fetchSongsByUser(song.userId));
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className='confirm-delete-modal'>
            <h3>Are you sure you want to delete this song?</h3>
            <h4>Doing so will delete all tracks made with this song and make creators unhappy.</h4>
            <div className='buttons'>
                <button className='cancel-button' onClick={handleCancel}>Cancel</button>
                <button className='delete-button' onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}

export default ConfirmSongDelete;
