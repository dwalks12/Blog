import React, { Component } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import Helmet from 'react-helmet';
import LazyLoad from 'react-lazy-load';
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';
export default class FrontPage extends Component {
	static propTypes = {}


	render() {


		return (
			<div>
				<Helmet title='Dawsons Site' />

				<div className={css(styles.dealerMetaContainer)}>
					<LazyLoad>
						<img className={css(styles.bannerImage)} src={'../images/Dawson.png'}/>
					</LazyLoad>
					<h1 className={css(styles.frontHeader)}>{'Dawson Walker'}</h1>
					<p style={{fontFamily: 'futura',}}>{'A blog of sorts'}</p>
				</div>
				<div className={css(styles.carouselContainer)}>
					<div className={css(styles.gridCarText)}>
					</div>
				</div>
				<div className={css(styles.paddingTop)}>

				</div>
			</div>
		);
	}
}

const styles = StyleSheet.create({
	dealerMetaContainer: {
		marginTop: '0.5rem',
		marginBottom: '10px',
		marginLeft: 'auto',
		marginRight: 'auto',
		textAlign: 'center',
	},
	frontHeader: {
		fontFamily: 'futura',
		marginTop: '25px',
		marginBottom: '15px',
	},
	bannerImage: {
		height: 'auto',
		width: 'auto',
		maxHeight: '600px',
		[`@media (max-width: ${ breakpoints.mdMin }px)`]: {
			width: '100%',
      margin: 'auto',
		},
	},
	carouselContainer: {
		position: 'relative',
	},
	paddingTop: {
		paddingTop: 0,
	},
	gridCarText: {
		fontWeight: 'normal',
		textAlign: 'center',
		width: '70%',
		paddingBottom: '1.5625em',
		margin: 'auto',
	},
	padding: {
		paddingTop: '0.725em',
	},

});
