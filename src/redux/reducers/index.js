import { combineReducers } from 'redux';
import { app } from './app';
import { auth } from '../../Core/onboarding/redux/auth';
import { chat } from '../../Core/chat/redux';
import { userReports } from '../../Core/user-reporting/redux';
import { favorites } from '../../Core/favorites/redux';

const LOG_OUT = 'LOG_OUT';

// combine reducers to build the state
const appReducer = combineReducers({
  auth,
  app,
  chat,
  userReports,
  favorites,
});

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
