import 'ConfirmSongDelete.css';

import { useDispatch } from 'react-redux';
import { removeSong } from '../../redux/songs';
import { useModal } from "../../context/Modal";

function ConfirmSongDelete({ song }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async () => {
        await dispatch(removeSong(song.id));
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className='confirm-delete-modal'>
            <h3>Are you sure you want to delete this song? Doing so will delete all tracks made with this song and make creators unhappy.</h3>
            <div className='buttons'>
                <button className='cancel-button' onClick={handleCancel}>Cancel</button>
                <button className='delete-button' onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}

export default ConfirmSongDelete;
