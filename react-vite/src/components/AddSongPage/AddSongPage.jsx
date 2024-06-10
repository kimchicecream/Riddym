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
    const [errors, setErrors] = useState({});
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

        const validationErrors = {};

        if (!songName) {
            validationErrors.songName = 'Song name must be at least 1 character long.';
        }
        if (!songFile) {
            validationErrors.songFile = 'MP3 must be uploaded.';
        }
        if (!artistName) {
            validationErrors.artistName = 'Song artist must be at least 1 character long.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

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
            <h2>First, let's add a new song to play over.</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>
                    <h4>SONG NAME</h4> {errors.songName && <p className="error">{errors.songName}</p>}
                    <input
                        type='text'
                        placeholder='Song Name'
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    <h4>UPLOAD MP3</h4> {errors.songFile && <p className="error">{errors.songFile}</p>}
                    <input
                        type='file'
                        accept='audio/mp3'
                        onChange={handleMP3Change}
                        required
                    />
                </label>

                <label>
                    <h4>DURATION</h4>
                    <input
                        type='number'
                        placeholder='Duration (seconds)'
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        readOnly
                    />
                </label>

                <label>
                    <h4>UPLOAD COVER ART</h4>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                </label>

                <label>
                    <h4>SONG ARTIST</h4> {errors.artistName && <p className="error">{errors.artistName}</p>}
                    <input
                        type='text'
                        placeholder='Artist Name'
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        required
                    />
                </label>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default AddSongPage;
