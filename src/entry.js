import React from 'react';
import ReactDOM from 'react-dom';
// import {store}from './store/store';
import { createHistory, useBasename, createHashHistory } from 'history';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import { Provider } from 'react-redux'
// var BrowserHistory = require('react-router/lib/browserHistory').default;
import createBrowserHistory from 'history/lib/createBrowserHistory';
import shouldUpdateScroll from './utility/shouldUpdateScroll';
import { useRouterHistory, browserHistory } from 'react-router';
import App from './App';
import appHistory from './utility/app_history';
//import './styling/global.css';
// import { createHistory, useBasename } from 'history'
const basename = ``;
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, applyMiddleware,combineReducers} from 'redux';
import { syncHistoryWithStore, routerReducer, push, replace  } from 'react-router-redux'
import rootReducer from './reducers/reducer';
// var defaultState = {data: {}};
var loggerMiddleware = createLogger();

var store = process.env.NODE_ENV !== 'production' ? createStore(
	combineReducers({
		rootReducer,
		routing: routerReducer,
	}),
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware,
	),
) : createStore(
	combineReducers({
		rootReducer,
		routing: routerReducer,
	}),
	applyMiddleware(
		thunkMiddleware,
	),
);

function analyticsService(location) {
	store.dispatch(push(location));
}

const history = syncHistoryWithStore(appHistory, store);
history.listen(location => analyticsService(location.pathname))

const root = document.getElementById('root');
const render = () => {

	const WrappedApp = () =>
			<Provider store={store}>
				<App history={history}/>
			</Provider>
	;

	ReactDOM.render(<WrappedApp />, root);
};
//
if (!global.Intl) {
		require.ensure([ 'intl' ], function (require) {
				require('intl');
				render();
		});
} else {
		render();
}
