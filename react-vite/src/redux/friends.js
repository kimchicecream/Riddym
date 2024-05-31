import { apiFetch } from "./utils/apiFetch";

const GET_ALL_FRIENDS = 'friends/getAllFriends'
const GET_USER_FRIENDS = 'friends/getUserFriends'
const ADD_FRIEND = 'friends/addFriend';
const UPDATE_FRIEND = 'friends/updateFriend';
const DELETE_FRIEND = 'friends/deleteFriend';


const getAllFriends = friends => ({
    type: GET_ALL_FRIENDS,
    payload: friends,
});

const gethUserFriends = friends => ({
    type: GET_USER_FRIENDS,
    payload: friends,
});

const addFriend = friend => ({
    type: ADD_FRIEND,
    payload: friend,
});

const updateFriend = friend => ({
    type: UPDATE_FRIEND,
    payload: friend,
});

const deleteFriend = friendId => ({
    type: DELETE_FRIEND,
    payload: friendId,
});

// Fetch all friends thunk
export const fetchAllFriends = () => async dispatch => {
    const { data, errors, error } = await apiFetch('/api/friends');

    if (errors || error) {
      return { errors: errors || error };
    }

    const objectData = data.reduce((acc, friend) => {
      acc[friend.id] = friend;
      return acc;
    }, {});

    dispatch(fetchAllFriends(objectData));
    return data;
};

// Fetch friends by user thunk
export const fetchFriendsByUser = userId => async dispatch => {
    const { data, errors, error } = await apiFetch(`/api/users/${userId}/friends`);

    if (errors || error) {
      return { errors: errors || error };
    }

    const objectData = data.reduce((acc, friend) => {
      acc[friend.id] = friend;
      return acc;
    }, {});

    dispatch(fetchUserFriendsSuccess(objectData));
    return data;
};

// Create friend thunk
export const createFriend = friendData => async dispatch => {
    const { data, errors, error } = await apiFetch('/api/friends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(friendData),
    });

    if (errors || error) {
      return { errors: errors || error };
    }

    dispatch(addFriend(data));
    return data;
};

// Edit friend thunk
export const editFriend = (friendId, friendData) => async dispatch => {
    const { data, errors, error } = await apiFetch(`/api/friends/${friendId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(friendData),
    });

    if (errors || error) {
      return { errors: errors || error };
    }

    dispatch(updateFriend(data));
    return data;
};

// Delete friend thunk
export const removeFriend = friendId => async dispatch => {
    const { errors, error } = await apiFetch(`/api/friends/${friendId}`, {
      method: 'DELETE',
    });

    if (errors || error) {
      return { errors: errors || error };
    }

    dispatch(deleteFriend(friendId));
    return { success: true };
};

const initialState = {
    allFriends: {},
    userFriends: {},
};

const friendsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_FRIENDS: {
            newState = { ...state, allFriends: action.payload };
            return newState;
        }
        case GET_USER_FRIENDS: {
            newState = { ...state, userFriends: action.payload };
            return newState;
        }
        case ADD_FRIEND: {
            newState = { ...state };
            newState.allFriends = { ...newState.allFriends, [action.payload.id]: { ...action.payload } };
            newState.userFriends = { ...newState.userFriends, [action.payload.id]: { ...action.payload } };
            return newState;
        }
        case UPDATE_FRIEND: {
            newState = { ...state };
            newState.allFriends[action.payload.id] = action.payload;
            newState.userFriends[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE_FRIEND: {
            newState = { ...state };
            delete newState.allFriends[action.payload];
            delete newState.userFriends[action.payload];
            return newState;
        }
        default:
            return state;
    }
};

export default friendsReducer;
