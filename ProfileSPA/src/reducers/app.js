import { combineReducers } from 'redux';
import auth from './auth';
import profile from './profile';
import ui from './ui';

export default combineReducers({
    auth,
    profile,
    ui
});