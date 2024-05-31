import { apiFetch } from './utils/apiFetch';

const GET_ALL_SCORES = 'scores/getAllScores';
const GET_SCORES_BY_USER = 'scores/getScoresByUser';
const ADD_SCORE = 'scores/addScore';
const UPDATE_SCORE = 'scores/updateScore';
const DELETE_SCORE = 'scores/deleteScore';

const getAllScores = scores => ({
    type: GET_ALL_SCORES,
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

// Get all scores thunk
export const fetchAllScores = () => async dispatch => {
    const { data, errors, error } = await apiFetch('/api/scores');

    if (errors || error) {
      return { errors: errors || error };
    }

    const objectData = data.reduce((acc, score) => {
      acc[score.id] = score;
      return acc;
    }, {});

    dispatch(getAllScores(objectData));
    return data;
};

// Fetch scores by user thunk
export const fetchScoresByUser = userId => async dispatch => {
    const { data, errors, error } = await apiFetch(`/api/users/${userId}/scores`);

    if (errors || error) {
      return { errors: errors || error };
    }

    const objectData = data.reduce((acc, score) => {
      acc[score.id] = score;
      return acc;
    }, {});

    dispatch(getScoresByUser(objectData));
    return data;
};

// Create score thunk
export const createScore = scoreData => async dispatch => {
    const { data, errors, error } = await apiFetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData),
    });

    if (errors || error) {
      return { errors: errors || error };
    }

    dispatch(addScore(data));
    return data;
};

// Edit score thunk
export const editScore = (scoreId, scoreData) => async dispatch => {
    const { data, errors, error } = await apiFetch(`/api/scores/${scoreId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData),
    });

    if (errors || error) {
      return { errors: errors || error };
    }

    dispatch(updateScore(data));
    return data;
};

// Delete score thunk
export const removeScore = scoreId => async dispatch => {
    const { errors, error } = await apiFetch(`/api/scores/${scoreId}`, {
      method: 'DELETE',
    });

    if (errors || error) {
      return { errors: errors || error };
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
        case GET_ALL_SCORES: {
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
