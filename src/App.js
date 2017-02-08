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

const App = ({history, location}) => (
	<Router history={history}>
		{/* Trailing slashes are ☹️ */}
		<Route path='/' getComponent={page('Base')}>
			<IndexRoute getComponent={page('Front')} />
			<Route path='contentpage'>
				<IndexRoute getComponent={page('ContentPage')} />
				<Route path='blogPost' getComponent={page('BlogPost')} />
				<Route key={'addpage'} path='addPage' getComponent={page('AddPage')}/>
				<Route key={'image'} path='image' getComponent={page('Image')}/>
				<Route key={'image-gallery'} path='image-gallery' getComponent={page('AdminGallery')}/>
			</Route>
			<Route key={'blogs'} path='blogs' getComponent={page('Blogs')}/>
			<Route key={'gallery'} path='gallery' getComponent={page('Gallery')}/>
			<Route key={'404'} path='404' getComponent={page('404')} />
			<Route key={'admin'} path='admin' getComponent={page('Admin')}/>
			<Route key={'post'} path='post' getComponent={page('Post')}/>
			<Redirect from='**' to='404' />
		</Route>
	</Router>
)

App.propTypes = {
	history: PropTypes.object.isRequired,
}

export default App;

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
