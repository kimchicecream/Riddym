import { apiFetch } from './utils/apiFetch';

const GET_ALL_TRACKS = 'tracks/getAllTracks';
const GET_ALL_TRACKS_BY_USER = 'tracks/getAllTracksByUser';
const ADD_TRACK = 'tracks/addTrack';
const UPDATE_TRACK = 'tracks/updateTrack';
const DELETE_TRACK = 'tracks/deleteTrack';

const getAllTracks = tracks => ({
    type: GET_ALL_TRACKS,
    payload: tracks,
});

const getAllTracksByUser = tracks => ({
    type: GET_ALL_TRACKS_BY_USER,
    payload: tracks,
});

const addTrack = track => ({
    type: ADD_TRACK,
    payload: track,
});

const updateTrack = track => ({
    type: UPDATE_TRACK,
    payload: track,
});

const deleteTrack = trackId => ({
    type: DELETE_TRACK,
    payload: trackId,
});

// Get all tracks thunk
export const fetchTracks = () => async dispatch => {
    const { data, errors, error } = await apiFetch('/api/tracks');

    if (errors || error) {
      return { errors: errors || error };
    }

    const objectData = data.reduce((acc, track) => {
      acc[track.id] = track;
      return acc;
    }, {});

    dispatch(getAllTracks(objectData));
    return data;
};

// Get all tracks by user thunk
export const fetchTracksByUser = userId => async dispatch => {
    const { data, errors, error } = await apiFetch(`/api/users/${userId}/tracks`);

    if (errors || error) {
      return { errors: errors || error };
    }

    const objectData = data.reduce((acc, track) => {
      acc[track.id] = track;
      return acc;
    }, {});

    dispatch(getAllTracksByUser(objectData));
    return data;
};

// Create track thunk
export const createTrack = trackData => async dispatch => {
    const { data, errors, error } = await apiFetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackData),
    });

    if (errors || error) {
      return { errors: errors || error };
    }

    dispatch(addTrack(data));
    return data;
};

// Edit track thunk
export const editTrack = (trackId, trackData) => async dispatch => {
    const { data, errors, error } = await apiFetch(`/api/tracks/${trackId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackData),
    });

    if (errors || error) {
      return { errors: errors || error };
    }

    dispatch(updateTrack(data));
    return data;
};

// Delete track thunk
export const removeTrack = trackId => async dispatch => {
    const { errors, error } = await apiFetch(`/api/tracks/${trackId}`, {
      method: 'DELETE',
    });

    if (errors || error) {
      return { errors: errors || error };
    }

    dispatch(deleteTrack(trackId));
    return { success: true };
};

const initialState = {
    allTracks: {},
    userTracks: {},
};

const tracksReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_TRACKS: {
            newState = { ...state, allTracks: action.payload };
            return newState;
        }
        case GET_ALL_TRACKS_BY_USER: {
        newState = { ...state, userTracks: action.payload };
        return newState;
        }
        case ADD_TRACK: {
            newState = { ...state };
            newState.allTracks = { ...newState.allTracks, [action.payload.id]: { ...action.payload } };
            newState.userTracks = { ...newState.userTracks, [action.payload.id]: { ...action.payload } };
            return newState;
        }
        case UPDATE_TRACK: {
            newState = { ...state };
            newState.allTracks[action.payload.id] = action.payload;
            newState.userTracks[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE_TRACK: {
            newState = { ...state };
            delete newState.allTracks[action.payload];
            delete newState.userTracks[action.payload];
            return newState;
        }
        default:
            return state;
    }
};

export default tracksReducer;