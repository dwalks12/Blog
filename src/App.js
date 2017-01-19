import 'babel-polyfill';

import React, { Component, PropTypes } from 'react';
// import cookies from 'cookies-js';
import _ from 'lodash';

import routes from './data/routes.js';
//import Analytics from 'utility/analytics';

import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import Redirect from 'react-router/lib/Redirect';
//polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)
export default class App extends Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		location: PropTypes.object,
	}

  static childContextTypes = {
    analytics: PropTypes.object,
  }

	constructor(props) {
		super(props);
		
		window._data = window._data || {};
	}

	getChildContext() {
    return {
			analytics: this.analytics,
		};
  }

	render() {
		return (
			<Router history={this.props.history}>
				{/* Trailing slashes are ☹️ */}
				<Redirect from='**/' to=':splat' />

				<Route path='/' getComponent={page('Base')}>
					<IndexRoute getComponent={page('Front')} />
					<Route path='image' getComponent={page('Image')}/>
					<Route path='gallery' getComponent={page('Gallery')}/>
					<Route path='404' getComponent={page('404')} />
					<Route path='admin' getComponent={page('Admin')}/>
					<Route path='content' getComponent={page('ContentPage')}/>
					<Route path='content/addPage' getComponent={page('AddPage')}/>
					<Route path='content/blogPost' getComponent={page('BlogPost')}/>
					// { PageRoutes }

					<Redirect from='**' to='404' />
				</Route>

			</Router>
		);
	}
}

const page = (page) => (location, cb) => {
	// if (__WEBPACK_SERVER__) {
    cb(null, require('./pages/' + page).default);
  // } else {
	// 	require.ensure([], (require) => {
	// 		cb(null, require('./pages/' + page).default);
	// 	});
	// }

};

const PageRoutes = Object.keys(routes.pages).map(pageId => {
	const componentName = _.upperFirst(pageId);
	const path = routes.pages[pageId];

	return <Route key={pageId} path={path} getComponent={page(componentName)} />;
});
