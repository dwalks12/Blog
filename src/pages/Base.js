import React, { Component, PropTypes } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';
// import { country } from 'config';
import { Link, IndexLink } from 'react-router';
import Helmet from 'react-helmet';

import FontLoader from '../containers/FontLoader';
// import TopMenu from 'containers/TopMenuContainer';
// import OpenTopMenu from 'modules/OpenTopMenu';
// import FooterMenu from 'modules/FooterMenu';
// import FooterLinks from 'presentational/FooterLinks';

// import { ProvideAnalytics } from 'utility/analytics';

export default class Base extends Component {
	static propTypes = {
		children: PropTypes.any,
	}

	constructor(props) {
		super(props);

		this.state = {
			menuOpen: false,
		};

	}

	componentDidMount() {
		const html = document.getElementsByTagName('html')[0];
		html.className = (html.className + ' ' + css(styles.html)).trim();
		if(this.props.location.pathname.indexOf('/content') >=0) {
			this.changeMenuState();
		}
	}

	componentWillUnmount() {
		const html = document.getElementsByTagName('html')[0];
		html.className = html.className.replace(css(styles.html), '').trim();

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
					to={'/content/addPage'}>
					{'Add Page'}
				</Link>
				<Link
					className={css(styles.menuItem)}
					to={'/content/blogPost'}>
					{'Blog Posts'}
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
						{'Home'}
				</Link>
				<Link
					className={css(styles.menuItem)}
					to={'/image'}>
					{'Upload'}
				</Link>
				<Link
					className={css(styles.menuItem)}
					to={'/gallery'}>
					{'Gallery'}
				</Link>
			</div>
				<div className={css(styles.content)}>
					{ this.props.children }
				</div>


		</div>;
	}

	render() {
		return (
			<div className={css(styles.base)}>
				<FontLoader fonts={webFonts} />
				<Helmet
					titleTemplate={'%s'}
					meta={[
						{ 'name': 'description', 'content': 'website description' },
					]}
				/>

				{ this.state.menuOpen
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
