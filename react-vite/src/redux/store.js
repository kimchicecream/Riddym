import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import songsReducer from './reducers/songReducer';
import tracksReducer from './reducers/trackReducer';
import friendsReducer from './reducers/friendReducer';
import scoresReducer from './reducers/scoreReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  songs: songsReducer,
  tracks: tracksReducer,
  friends: friendsReducer,
  scores: scoresReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
