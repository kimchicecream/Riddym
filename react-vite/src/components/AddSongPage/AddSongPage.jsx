import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSong } from '../../redux/songs';
import { useNavigate } from 'react-router-dom';
import './AddSongPage.css';

function AddSongPage() {
    const [songName, setSongName] = useState('');
    const [duration, setDuration] = useState('');
    const [songFile, setSongFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [artistName, setArtistName] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMP3Change = (e) => {
        const file = e.target.files[0];
        setSongFile(file);

        // get duration (seconds) of song
        if (file) {
            const audio = document.createElement('audio');
            audio.src = URL.createObjectURL(file);

            audio.onloadedmetadata = () => {
                setDuration(Math.round(audio.duration)); // in seconds
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('song_name', songName);
        formData.append('duration', duration);
        formData.append('song_file', songFile);
        formData.append('image_file', imageFile);
        formData.append('artist_name', artistName);
        // formData.append('creator_id', user.id);

        const result = await dispatch(createSong(formData));

        if (result.errors) {
            console.error('Errors:', result.errors);
        } else {
            console.log('Song created:', result);
            navigate(`/track-creator/${result.id}`);
        }
    }

    return (
        <div className='add-song-page'>
            <h2>Add a new song</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input
                    type='text'
                    placeholder='Song Name'
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    required
                />
                <input
                    type='number'
                    placeholder='Duration (seconds)'
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    readOnly
                />
                <input
                    type='file'
                    accept='audio/mp3'
                    onChange={handleMP3Change}
                    required
                />
                <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
                <input
                    type='text'
                    placeholder='Artist Name'
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    required
                />
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default AddSongPage;
