import { useDispatch, useSelector  } from 'react-redux';
import { fetchTracksByUser, removeTrack } from '../../redux/tracks';
import { useModal } from "../../context/Modal";

import './ConfirmDelete.css';

function ConfirmDelete({ track }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const userId = useSelector(state => state.session.user.id);

    const handleDelete = async () => {
        await dispatch(removeTrack(track.id));
        await dispatch(fetchTracksByUser(userId));
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className='confirm-delete-modal'>
            <h3>Are you sure you want to delete this track?</h3>
            <div className='buttons'>
                <button className='cancel-button' onClick={handleCancel}>Cancel</button>
                <button className='delete-button' onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}

export default ConfirmDelete;
