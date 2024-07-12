import './EditSongModal.jsx';
import { editSong, fetchSongsByUser } from '../../redux/songs.js';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal.jsx';

function EditSongModal({ song }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [songName, setSongName] = useState(song.song_name);
    const [artistName, setArtistName] = useState(song.artist_name);
    const [errors, setErrors] = useState({});
    const userId = useSelector(state => state.session.user.id);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!songName) validationErrors.songName = "Song name can't be empty";
        if (!artistName) validationErrors.artistName = "Artist name can't be empty";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const updatedSong = {
            song_name: songName,
            artist_name: artistName,
        };

        const result = await dispatch(editSong(song.id, updatedSong));

        if (result.errors) {
            setErrors(result.errors);
        } else {
            await dispatch(fetchSongsByUser(userId));
            closeModal();
        }
    }

    return (
        <div className="edit-song-modal">
            <h2>Edit Song</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="song-name">Song Name</label>
                    <input
                        id="song-name"
                        type="text"
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                    />
                    {errors.songName && <p className="error">{errors.songName}</p>}
                </div>
                <div>
                    <label htmlFor="artist-name">Artist Name</label>
                    <input
                        id="artist-name"
                        type="text"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                    />
                    {errors.artistName && <p className="error">{errors.artistName}</p>}
                </div>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </form>
        </div>
    )
}

export default EditSongModal;
