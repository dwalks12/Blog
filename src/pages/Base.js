import React, { Component, PropTypes } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';

import { Link, IndexLink } from 'react-router';
import Helmet from 'react-helmet';

import FontLoader from '../containers/FontLoader';

export default class Base extends Component {
	static propTypes = {
		children: PropTypes.any,
		openMenu: PropTypes.bool,

	}
	static contextTypes = {
		store: PropTypes.object,
	}
	constructor(props) {
		super(props);

	}

	componentWillMount() {
		this.checkLocationAddress();
	}
	checkLocationAddress() {
		if(this.props.location.pathname.indexOf('/contentpage') >=0) {
			this.changeMenuState();
		} else if(this.props.location.pathname === '/') {
			this.changeMenuStateFalse();
		}
	}
	componentWillUnmount() {

	}
	changeMenuStateFalse() {
		this.setState({
			menuOpen: false,
		});
	}
	changeMenuState() {
		this.setState({
			menuOpen: true,
		});
	}
	renderAdminPage() {

		return <div>
				<Link
					className={css(styles.menuItem)}
					to={'/'}>
					<i className="material-icons">&#xE88A;</i>
				</Link>
				<Link
					className={css(styles.menuItem)}
					to={'/contentpage'}>
					{'Front Page Manger'}
				</Link>
				<Link
					className={css(styles.menuItem)}
					to={'/contentpage/addPage'}>
					{'Add Page'}
				</Link>
				<Link
					className={css(styles.menuItem)}
					to={'/contentpage/blogPost'}>
					{'Blog Posts'}
				</Link>
				<Link
					className={css(styles.menuItem)}
					to={'/contentpage/image'}>
					{'Upload Images'}
				</Link>
				<Link
					className={css(styles.menuItem)}
					to={'/contentpage/image-gallery'}>
					{'Image Gallery'}
				</Link>
				<div className={css(styles.content)}>
					{this.props.children}
				</div>
			</div>
	}
	renderPage() {
		return <div>
			<div className={css(styles.top)}>
				<Link
					className={css(styles.menuItem)}
					to={'/'}>
						<i className="material-icons">&#xE88A;</i>
				</Link>
				<Link
					className={css(styles.menuItem)}
					to={'/gallery'}>
					{'Image Gallery'}
				</Link>
			</div>
				<div className={css(styles.content)}>
					{ this.props.children }
				</div>


		</div>;
	}
	checkStateChange(state) {
		const route = state.routing.locationBeforeTransitions.pathname;
		return (route.indexOf('/contentpage') >= 0);
	}
	render() {
		const {store} = this.context;
		// console.log(store.getState());
		const storeState = store.getState();
		const getMenuChange = this.checkStateChange(storeState);
		// this.checkStateChange(storeState);
		return (
			<div className={css(styles.base)}>
				<FontLoader fonts={webFonts} />
				<Helmet
					titleTemplate={'%s'}
					meta={[
						{ 'name': 'description', 'content': 'website description' },
					]}
				/>

				{ getMenuChange
					?
							this.renderAdminPage()
					: this.renderPage()
				}
				<div className={css(styles.footer)}>
						<div><p className={css(styles.footerHeader)}>{'Made by Dawson'}</p></div>
				</div>
			</div>
		);
	}
}

const styles = StyleSheet.create({
	html: {
		fontSize: '5vw',

		[`@media (min-width: ${ breakpoints.smMin }px)`]: {
			fontSize: '16px',
		},

		[`@media (min-width: ${ breakpoints.lgMin }px)`]: {
			fontSize: '20px',
		},
	},
	footerHeader: {
		color: 'white',
		paddingTop: '150px',
		paddingLeft: '50px',
		fontFamily: 'futura',
	},
	base: {
		width: '100%',
		margin: '0 auto',
		position: 'relative',
	},
	footer: {
			width: '100%',
			height: '200px',
			background: 'black',
		},
	content: {
		padding: `0 ${marginsAtWidth(breakpoints.smMin)}px`,

		[`@media (min-width: ${ breakpoints.mdMin }px)`]: {
			padding: `0 ${marginsAtWidth(breakpoints.mdMin)}px`,
		},

		[`@media (min-width: ${ breakpoints.lgMin }px)`]: {
			padding: `0 ${marginsAtWidth(breakpoints.lgMin)}px`,
		},
	},
	menuItem: {
		fontWeight: 'normal',
		fontFamily: 'futura',
		color: 'black',
		fontSize: '30px',
		padding: '15px',
		cursor: 'pointer',
		':hover': {
			color: 'grey',
			textShadow: '0px 0px 2px white',
			textDecoration: 'underline',
		},
		width: '15%',
		textAlign: 'center',
		[`@media (max-width: ${ breakpoints.smMin }px)`]: {
			fontSize: '17px !important',
			padding: '10px',
		},
	},
	top: {
		paddingTop: 10,
		paddingBottom: 10,
		width: '100%',
		margin: 'auto',
		float: 'none',
		textAlign: 'center',
		display: 'inline-block',
	},
});
