import { createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import app from './reducers/app';

// If you have the Redux Dev Tools extension installed on your browser, this enables it
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
    return createStore(app, composeEnhancers(applyMiddleware(thunk))); // thunk middleware
}