import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSong } from '../../redux/songs';
import { useNavigate } from 'react-router-dom';
import { fetchSongs } from '../../redux/songs';
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
    const imageInputRef = useRef(null);
    const mp3InputRef = useRef(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [mp3FileName, setMp3FileName] = useState('Choose MP3 to Upload');
    const songs = useSelector(state => state.songs.allSongs);
    const [selectedSong, setSelectedSong] = useState(null);

    const handleMP3Change = (e) => {
        const file = e.target.files[0];
        setSongFile(file);

        setMp3FileName(file.name);

        // get duration (seconds) of song
        if (file) {
            const audio = document.createElement('audio');
            audio.src = URL.createObjectURL(file);

            audio.onloadedmetadata = () => {
                setDuration(Math.round(audio.duration)); // in seconds
            };
        }
    };

    useEffect(() => {
        dispatch(fetchSongs());
    }, [dispatch]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        // image preview
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
            console.log('Validation errors:', validationErrors);
            return;
        }

        const formData = new FormData()
        formData.append('song_name', songName);
        formData.append('duration', duration);
        formData.append('song_file', songFile);
        formData.append('image_file', imageFile);
        formData.append('artist_name', artistName);
        // formData.append('creator_id', user.id);

        // const result = await dispatch(createSong(formData));

        const result = await dispatch(createSong(formData));

        if (result.errors) {
            console.error('Errors:', result.errors);
        } else {
            if (navigateToTrackCreator) {
                const songId = result.song?.id || result.id;
                navigate(`/track-creator/${songId}`);
            } else {
                navigate(`/session-overview/${sessionUser.username}`);
            }
        }
    }

    const formatDuration = (duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleFormSubmit = (e) => {
        handleSubmit(e, true);
    };

    return (
        <div className='add-song-page'>
            <div className='add-song-section'>
                <h1>Add a new song <i className="fa-solid fa-angle-down"></i></h1>
                <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                    <div className='form'>
                        <div className='art'>
                            <label className='cover-art'>
                                {/* <h4>UPLOAD COVER ART</h4> */}
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    ref={imageInputRef}
                                />
                                <button type="button" className={isImageUploaded ? 'image-uploaded' : ''} onClick={() => imageInputRef.current.click()}>
                                    {isImageUploaded ? '' : 'Upload cover art'}
                                </button>
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
                                {errors.songFile && <p className="error">{errors.songFile}</p>}
                                <input
                                    type='file'
                                    accept='audio/mp3'
                                    onChange={handleMP3Change}
                                    required
                                    ref={mp3InputRef}
                                />
                                <button type="button" className='upload-button' onClick={() => mp3InputRef.current.click()}>
                                    <i className="fa-solid fa-arrow-up-from-bracket"></i>{mp3FileName}
                                </button>
                            </label>
                            {songFile && (
                                <label className='duration'>
                                    <h4>DURATION</h4>
                                    <input
                                        type='text'
                                        value={`${duration} seconds`}
                                        onChange={(e) => setDuration(e.target.value)}
                                        readOnly
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                    <div className='buttons'>
                        <button className='add-song-button' type='button' onClick={(e) => handleSubmit(e, false)}>
                            Add Song
                        </button>
                        <button type='submit' className='continue-button'>
                            Continue to Track Creator
                        </button>
                    </div>
                </form>
            </div>
            <div className='pick-song-section'>
                <h1>Pick a song <i className="fa-solid fa-angle-down"></i></h1>
                <div className='pick-song-container'>
                    <div className='search-bar'></div>
                    <div className='all-songs-container'>
                            {Object.values(songs).map(song => (
                                <div
                                    className={`song-card ${selectedSong?.id === song.id ? 'selected' : ''}`}
                                    key={song.id}
                                    onClick={() => setSelectedSong(song)}
                                >
                                    <img src={song.image_url} />
                                    <div className='song-details'>
                                        <h4>{song.song_name}</h4>
                                        <p>{song.artist_name}</p>
                                        <p>{formatDuration(song.duration)}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className='buttons'>
                        {selectedSong && (
                            <div className='selected-display'>
                                Selected
                                <div className='mini-song-card'>
                                    <div className='mini-img'>
                                        <img src={selectedSong.image_url} />
                                    </div>
                                    <div className='mini-song-details'>
                                        <p>{selectedSong.song_name}</p>
                                        <p>{selectedSong.artist_name}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button>Continue to Track Creator</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddSongPage;
