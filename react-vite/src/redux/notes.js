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

    dispatch(updateNote(data));
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
export const updateTrackId = data => async dispatch => {
    const response = await fetch('/api/notes/update-track-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      return { errors: error.errors || error };
    }

    const resData = await response.json();
    return resData;
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
            newState.trackNotes = { ...newState.trackNotes, [action.payload.id]: { ...action.payload } };
            return newState;
        }
        case DELETE_NOTE: {
            newState = { ...state };
            newState.trackNotes = { ...newState.trackNotes };
            delete newState.trackNotes[action.payload];
            return newState;
        }
        default:
            return state;
    }
};

export default notesReducer;
