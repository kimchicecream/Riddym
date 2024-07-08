import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    const sessionUser = useSelector(state => state.session.user);
    const fileInputRef = useRef(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        // Preview the image
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const button = document.querySelector('.cover-art button');
                button.style.backgroundImage = `url(${reader.result})`;
                setIsImageUploaded(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e, navigateToTrackCreator = true) => {
        e.preventDefault();

        const validationErrors = {};

        if (!songName) {
            validationErrors.songName = "Song name field can't be empty.";
        }
        if (!songFile) {
            validationErrors.songFile = 'An MP3 file is required.';
        }
        if (!artistName) {
            validationErrors.artistName = "Song artist field can't be empty.";
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
            if (navigateToTrackCreator) {
                navigate(`/track-creator/${result.song.id}`);
            } else {
                navigate(`/session-overview/${sessionUser.username}`);
            }
        }
    }

    const handleFormSubmit = (e) => handleSubmit(e, true);

    return (
        <div className='add-song-page'>
            <div className='add-song-section'>
                <h1>Add a new song <i className="fa-solid fa-angle-down"></i></h1>
                <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                    <div className='art'>
                        <label className='cover-art'>
                            {/* <h4>UPLOAD COVER ART</h4> */}
                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleImageChange}
                                ref={fileInputRef}
                            />
                            <button type="button" className={isImageUploaded ? 'image-uploaded' : ''} onClick={() => fileInputRef.current.click()}>{isImageUploaded ? '' : 'Upload cover art'}</button>
                        </label>
                        <div className='name-artist'>
                            <label className='name'>
                                <h4>SONG NAME</h4> {errors.songName && <p className="error">{errors.songName}</p>}
                                <input
                                    type='text'
                                    value={songName}
                                    onChange={(e) => setSongName(e.target.value)}
                                    required
                                />
                            </label>
                            <label className='artist'>
                                <h4>ARTIST</h4> {errors.artistName && <p className="error">{errors.artistName}</p>}
                                <input
                                    type='text'
                                    value={artistName}
                                    onChange={(e) => setArtistName(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                    </div>
                    <div className='file-duration'>
                        <label className='file'>
                            <h4>UPLOAD MP3</h4> {errors.songFile && <p className="error">{errors.songFile}</p>}
                            <input
                                type='file'
                                accept='audio/mp3'
                                onChange={handleMP3Change}
                                required
                            />
                        </label>
                        <label className='duration'>
                            <h4>DURATION</h4>
                            <input
                                type='number'
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                readOnly
                            />
                        </label>
                    </div>
                </form>
                <div className='buttons'>
                    <button className='add-song-button' type='button' onClick={(e) => handleSubmit(e, false)}>
                        Only Add Song
                    </button>
                    <button type='submit' className='continue-button'>Continue to Track Creator</button>
                </div>
            </div>
            <div className='pick-song-section'>
                <h1>Pick a song <i className="fa-solid fa-angle-down"></i></h1>
            </div>
        </div>
    )
}

export default AddSongPage;
