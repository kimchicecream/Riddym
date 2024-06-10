const GET_ALL_SONGS = 'songs/getAllSongs';
const GET_ALL_SONGS_BY_USER = 'songs/getAllSongsByUser'
const ADD_SONG = 'songs/addSong'
const UPDATE_SONG = 'songs/updateSong'
const DELETE_SONG = 'songs/deleteSong'

const getAllSongs = songs => ({
    type: GET_ALL_SONGS,
    payload: songs,
});

const getAllSongsByUser = songs => ({
    type: GET_ALL_SONGS_BY_USER,
    payload: songs,
});

const addSong = song => ({
    type: ADD_SONG,
    payload: song,
});

const updateSong = song => ({
    type: UPDATE_SONG,
    payload: song,
});

const deleteSong = songId => ({
    type: DELETE_SONG,
    payload: songId,
});

// Get all songs thunk
export const fetchSongs = () => async dispatch =>{
    const response = await fetch('/api/songs');
    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }
    const data = await response.json();

    const objectData = data.reduce((acc, song) => {
        acc[song.id] = song;
        return acc;
    }, {});

    dispatch(getAllSongs(objectData));
    return data;
}

// Get all songs by user thunk
export const fetchSongsByUser = userId => async dispatch => {
    const response = await fetch(`/api/songs/user/${userId}`);
    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }
    const data = await response.json();

    const objectData = data.reduce((acc, song) => {
        acc[song.id] = song;
        return acc;
    }, {});

    dispatch(getAllSongsByUser(objectData));
    return data;
};

// Create song thunk
export const createSong = songData => async dispatch => {
    const response = await fetch('/api/songs/create', {
        method: 'POST',
        body: songData,
    });
    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }
    const data = await response.json();

    dispatch(addSong(data));
    return data;
};

// Edit song thunk
export const editSong = (songId, songData) => async dispatch => {
    const response = await fetch(`/api/songs/${songId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(songData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }
    const data = await response.json();

    dispatch(updateSong(data));
    return data;
};

// Delete song thunk
export const removeSong = songId => async dispatch => {
    const response = await fetch(`/api/songs/${songId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }

    dispatch(deleteSong(songId));
    return { success: true };
};

const initialState = {
    allSongs: {},
    userSongs: {}
};

const songsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_SONGS: {
            newState = { ...state, allSongs: action.payload };
            return newState;
        }
        case GET_ALL_SONGS_BY_USER: {
            newState = { ...state, userSongs: action.payload };
            return newState;
        }
        case ADD_SONG: {
            newState = { ...state };
            newState.allSongs = { ...newState.allSongs, [action.payload.id]: action.payload };
            newState.userSongs = { ...newState.userSongs, [action.payload.id]: action.payload };
            return newState;
        }
        case UPDATE_SONG: {
            newState = { ...state };
            newState.allSongs[action.payload.id] = action.payload;
            newState.userSongs[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE_SONG: {
            newState = { ...state };
            delete newState.allSongs[action.payload];
            delete newState.userSongs[action.payload];
            return newState;
        }
        default:
            return state;
    }
}

export default songsReducer;
