
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import React from 'react';
import { render } from 'react-dom';
import "babel-polyfill";
import App from 'Components/App';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from 'Store/configureStore'
const initialState = window.__initialState;
const store = configureStore();

render(
   	<Provider store={store}>
            <App/>
    </Provider>,
    document.getElementById('root')
);

