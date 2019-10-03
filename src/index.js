import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createStore, combineReducers} from 'redux';
import authReducer from './store/reducers/authReducer';
import adminReducer from './store/reducers/adminReducer';
import userReducer from './store/reducers/userReducer';
import cartReducer from './store/reducers/cartReducer';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';

// Gab: This set-up uses a simple redux and redux devtools. Without using middleware (thunk) or enhancers.

const store = createStore(
    combineReducers({
        auth: authReducer,
        admin: adminReducer,
        user: userReducer,
        cart: cartReducer
    }),
    process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : ''
);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
