const GET_NOTES_BY_TRACK = 'notes/getNotesByTrack';
const ADD_NOTE = 'notes/addNote';
const UPDATE_NOTE = 'notes/updateNote';
const DELETE_NOTE = 'notes/deleteNote';
const UPDATE_TRACK_ID = 'notes/updateTrackId';
export const CLEAR_TRACK_NOTES = 'notes/clearTrackNotes';
export const SET_TRACK_NOTES = 'notes/setTrackNotes';

const getNotesByTrack = notes => ({
    type: GET_NOTES_BY_TRACK,
    payload: notes,
});

const addNote = note => ({
    type: ADD_NOTE,
    payload: note,
});

const updateNote = note => ({
    type: UPDATE_NOTE,
    payload: note,
});

const deleteNote = noteId => ({
    type: DELETE_NOTE,
    payload: noteId,
});

const updateTrackIdAction = (tempTrackId, trackId) => ({
    type: UPDATE_TRACK_ID,
    payload: { tempTrackId, trackId },
});

export const clearTrackNotes = () => ({
    type: CLEAR_TRACK_NOTES,
});

export const setTrackNotes = (notes) => ({
    type: SET_TRACK_NOTES,
    payload: notes,
});

// Get notes by track thunk
export const fetchNotesByTrack = trackId => async dispatch => {
  const response = await fetch(`/api/tracks/${trackId}/notes`);
  if (!response.ok) {
      const errorData = await response.json();
      return { errors: errorData.errors || errorData };
  }
  const data = await response.json();

  const objectData = data.reduce((acc, note) => {
      acc[note.id] = note;
      return acc;
  }, {});

  dispatch(getNotesByTrack(objectData));
  return data;
};

// Create note thunk
export const createNote = noteData => async dispatch => {
  const response = await fetch('/api/notes/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
  });
  if (!response.ok) {
      const errorData = await response.json();
      return { errors: errorData.errors || errorData };
  }
  const data = await response.json();

  dispatch(addNote(data));
  return data;
};

// Edit note thunk
export const editNote = (noteId, noteData) => async dispatch => {
    const response = await fetch(`/api/notes/${noteId}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }
    const data = await response.json();
    dispatch(updateNote({
        id: noteId,
        ...noteData,
    }));
    return data;
};

// Delete note thunk
export const removeNote = noteId => async dispatch => {
  const response = await fetch(`/api/notes/${noteId}/delete`, {
      method: 'DELETE',
  });
  if (!response.ok) {
      const errorData = await response.json();
      return { errors: errorData.errors || errorData };
  }

  dispatch(deleteNote(noteId));
  return { success: true };
};

// Update track ID thunk
export const updateTrackIdThunk = (data) => async dispatch => {
    const response = await fetch('/api/notes/update-track-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }

    dispatch(updateTrackIdAction(data.temp_track_id, data.track_id));
    return { success: true };
};

const initialState = {
    trackNotes: {}
};

const notesReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_NOTES_BY_TRACK: {
            newState = { ...state, trackNotes: action.payload };
            return newState;
        }
        case ADD_NOTE: {
            newState = { ...state };
            if (!newState.trackNotes[action.payload.id]) {
                newState.trackNotes = { ...newState.trackNotes, [action.payload.id]: { ...action.payload } };
            }
            return newState;
        }
        case UPDATE_NOTE:
            return {
                ...state,
                trackNotes: {
                    ...state.trackNotes,
                    [action.payload.id]: action.payload,
                },
            };
        case DELETE_NOTE: {
            newState = { ...state };
            newState.trackNotes = { ...newState.trackNotes };
            delete newState.trackNotes[action.payload];
            return newState;
        }
        case UPDATE_TRACK_ID: {
            newState = { ...state };
            Object.values(newState.trackNotes).forEach(note => {
                if (note.temp_track_id === action.payload.tempTrackId) {
                    note.track_id = action.payload.trackId;
                }
            });
            return newState;
        }
        case SET_TRACK_NOTES: {
            newState = { ...state, trackNotes: action.payload };
            return newState;
        }
        case CLEAR_TRACK_NOTES: {
            newState = { ...state, trackNotes: {} };
            return newState;
        }
        default:
            return state;
    }
};

export default notesReducer;
