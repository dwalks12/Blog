import React from 'react';
import ReactDOM from 'react-dom';

import { createHistory, useBasename, createHashHistory } from 'history';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

var BrowserHistory = require('react-router/lib/browserHistory').default;
import createBrowserHistory from 'history/lib/createBrowserHistory';
import shouldUpdateScroll from './utility/shouldUpdateScroll';
import { useRouterHistory, browserHistory } from 'react-router';
import App from './App';
import appHistory from './utility/app_history';
//import './styling/global.css';

const basename = ``;

// const history = useScroll(useRouterHistory(createHistory))({
// 	basename,
// 	shouldUpdateScroll,
// });
// const history = useBasename(createHistory)({basename});
const history = appHistory;//useRouterHistory(createHashHistory)({queryKey: false});
const root = document.getElementById('root');
const render = () => {
	const WrappedApp = () =>
		<div>
			<App history={history} />
		</div>
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
