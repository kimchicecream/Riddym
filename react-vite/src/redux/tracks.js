const GET_ALL_TRACKS = 'tracks/getAllTracks';
const GET_ALL_TRACKS_BY_USER = 'tracks/getAllTracksByUser';
const GET_TRACK_BY_ID = 'tracks/getTrackById';
const ADD_TRACK = 'tracks/addTrack';
const UPDATE_TRACK = 'tracks/updateTrack';
const DELETE_TRACK = 'tracks/deleteTrack';
export const CLEAR_TRACK_NOTES = 'notes/clearTrackNotes';
export const SET_TRACK_NOTES = 'notes/setTrackNotes';

const getAllTracks = tracks => ({
    type: GET_ALL_TRACKS,
    payload: tracks,
});

const getAllTracksByUser = tracks => ({
    type: GET_ALL_TRACKS_BY_USER,
    payload: tracks,
});

const getTrackById = track => ({
    type: GET_TRACK_BY_ID,
    payload: track,
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

export const clearTrackNotes = () => ({
    type: CLEAR_TRACK_NOTES,
});

export const setTrackNotes = (notes) => ({
    type: SET_TRACK_NOTES,
    payload: notes,
});

// Get all tracks thunk
export const fetchTracks = () => async dispatch => {
  const response = await fetch('/api/tracks/all');
  if (!response.ok) {
      const errorData = await response.json();
      return { errors: errorData.errors || errorData };
  }
  const data = await response.json();

  const objectData = data.reduce((acc, track) => {
      acc[track.id] = track;
      return acc;
  }, {});

  dispatch(getAllTracks(objectData));
  return data;
};

// Get all tracks by user thunk
export const fetchTracksByUser = userId => async dispatch => {
    const response = await fetch(`/api/tracks/user/${userId}`);
    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }
    const data = await response.json();

    const objectData = data.reduce((acc, track) => {
        acc[track.id] = track;
        return acc;
    }, {});

    dispatch(getAllTracksByUser(objectData));
    return data;
};

export const fetchTrackById = trackId => async dispatch => {
    const response = await fetch(`/api/tracks/${trackId}`);
    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }
    const data = await response.json();
    dispatch(getTrackById(data));
    return data;
  };

// Create track thunk
export const createTrack = trackData => async dispatch => {
    const response = await fetch('/api/tracks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }
    const data = await response.json();

    dispatch(addTrack(data));
    return data;
};

// Edit track thunk
export const editTrack = (trackId, trackData) => async dispatch => {
    const response = await fetch(`/api/tracks/${trackId}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }
    const data = await response.json();

    dispatch(updateTrack(data));
    return data;
};

// Delete track thunk
export const removeTrack = trackId => async dispatch => {
  const response = await fetch(`/api/tracks/${trackId}/delete`, {
    method: 'DELETE',
  });
  if (!response.ok) {
      const errorData = await response.json();
      return { errors: errorData.errors || errorData };
  }

  dispatch(deleteTrack(trackId));
  return { success: true };
};

const initialState = {
    allTracks: {},
    userTracks: {}
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
        case GET_TRACK_BY_ID: {
            newState = { ...state };
            newState.allTracks[action.payload.id] = action.payload;
            newState.userTracks[action.payload.id] = action.payload;
            return newState;
        }
        case ADD_TRACK: {
            newState = { ...state };
            newState.allTracks[action.payload.id] = action.payload;
            newState.userTracks[action.payload.id] = action.payload;
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
