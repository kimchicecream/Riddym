const GET_SCORES_BY_TRACK = 'scores/getScoresByTrack';
const GET_SCORES_BY_USER = 'scores/getScoresByUser';
const ADD_SCORE = 'scores/addScore';
const UPDATE_SCORE = 'scores/updateScore';
const DELETE_SCORE = 'scores/deleteScore';

const getScoresByTrack = scores => ({
    type: GET_SCORES_BY_TRACK,
    payload: scores,
});

const getScoresByUser = scores => ({
    type: GET_SCORES_BY_USER,
    payload: scores,
});

const addScore = score => ({
    type: ADD_SCORE,
    payload: score,
});

const updateScore = score => ({
    type: UPDATE_SCORE,
    payload: score,
});

const deleteScore = scoreId => ({
    type: DELETE_SCORE,
    payload: scoreId,
});

// Get scores by track thunk
export const fetchScoresByTrack = trackId => async dispatch => {
    const response = await fetch(`/api/tracks/${trackId}/scores`, {
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }

    const data = await response.json();
    const objectData = data.reduce((acc, score) => {
        acc[score.id] = score;
        return acc;
    }, {});

    dispatch(getScoresByTrack(objectData));
    return data;
};

// Get scores by user thunk
export const fetchScoresByUser = userId => async dispatch => {
    console.log(`Fetching scores for user ID: ${userId}`);

    const response = await fetch(`/api/scores/user/${userId}`, {
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }
    const data = await response.json();

    const objectData = data.reduce((acc, score) => {
        acc[score.id] = score;
        return acc;
    }, {});

    dispatch(getScoresByUser(objectData));
    return data;
};

// Create score thunk
export const createScore = scoreData => async (dispatch) => {
    const response = await fetch('/api/scores/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData),
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors || errorData };
    }

    const data = await response.json();
    dispatch(addScore(data));
    return data;
};

// Edit score thunk
export const editScore = (scoreId, scoreData) => async dispatch => {
  const response = await fetch(`/api/scores/${scoreId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData),
  });
  if (!response.ok) {
      const errorData = await response.json();
      return { errors: errorData.errors || errorData };
  }
  const data = await response.json();

  dispatch(updateScore(data));
  return data;
};

// Delete score thunk
export const removeScore = scoreId => async dispatch => {
  const response = await fetch(`/api/scores/${scoreId}`, {
      method: 'DELETE',
  });
  if (!response.ok) {
      const errorData = await response.json();
      return { errors: errorData.errors || errorData };
  }

  dispatch(deleteScore(scoreId));
  return { success: true };
};

const initialState = {
    allScores: {},
    userScores: {},
};

const scoresReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_SCORES_BY_TRACK: {
            newState = { ...state, allScores: action.payload };
            return newState;
        }
        case GET_SCORES_BY_USER: {
            newState = { ...state, userScores: action.payload };
            return newState;
        }
        case ADD_SCORE: {
            newState = { ...state };
            newState.allScores = { ...newState.allScores, [action.payload.id]: { ...action.payload } };
            newState.userScores = { ...newState.userScores, [action.payload.id]: { ...action.payload } };
            return newState;
        }
        case UPDATE_SCORE: {
            newState = { ...state };
            newState.allScores[action.payload.id] = action.payload;
            newState.userScores[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE_SCORE: {
            newState = { ...state };
            delete newState.allScores[action.payload];
            delete newState.userScores[action.payload];
            return newState;
        }
        default:
            return state;
    }
};

export default scoresReducer;
