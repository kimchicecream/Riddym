import { apiFetch } from './utils/apiFetch';
const GET_NOTES_BY_TRACK = 'notes/getNotesByTrack';
const ADD_NOTE = 'notes/addNote';
const UPDATE_NOTE = 'notes/updateNote';
const DELETE_NOTE = 'notes/deleteNote';

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

// Get notes by track thunk
export const fetchNotesByTrack = trackId => async dispatch => {
    const { data, errors, error } = await apiFetch(`/api/tracks/${trackId}/notes`);

    if (errors || error) {
      return { errors: errors || error };
    }

    const objectData = data.reduce((acc, note) => {
      acc[note.id] = note;
      return acc;
    }, {});

    dispatch(getNotesByTrack(objectData));
    return data;
};

// Create note thunk
export const createNote = noteData => async dispatch => {
    const { data, errors, error } = await apiFetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });

    if (errors || error) {
      return { errors: errors || error };
    }

    dispatch(addNote(data));
    return data;
};

// Edit note thunk
export const editNote = (noteId, noteData) => async dispatch => {
    const { data, errors, error } = await apiFetch(`/api/notes/${noteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });

    if (errors || error) {
      return { errors: errors || error };
    }

    dispatch(updateNote(data));
    return data;
};

// Delete note thunk
export const removeNote = noteId => async dispatch => {
    const { errors, error } = await apiFetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    });

    if (errors || error) {
      return { errors: errors || error };
    }

    dispatch(deleteNote(noteId));
    return { success: true };
};

const initialState = {
    trackNotes: {},
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
            newState.trackNotes = { ...newState.trackNotes, [action.payload.id]: { ...action.payload } };
            return newState;
        }
        case UPDATE_NOTE: {
            newState = { ...state };
            newState.trackNotes[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE_NOTE: {
            newState = { ...state };
            delete newState.trackNotes[action.payload];
            return newState;
        }
        default:
            return state;
    }
};

export default notesReducer;
