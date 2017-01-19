import React, { Component } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import Helmet from 'react-helmet';
import LazyLoad from 'react-lazy-load';
import $ from 'jquery';
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';
import appHistory from '../utility/app_history';
//const postURL = 'https://beverlywalker.herokuapp.com'; // 'http://localhost:3000';
const URLS = require('../../models/config.js');
const postURL = URLS.globalUrl;
import {isTokenExpired, getTokenExpirationDate} from '../helpers/jwtHelper';

export default class ContentPage extends Component {
	static propTypes = {}

  constructor(props) {
    super(props);
    //console.log('the session token is ', sessionStorage.getItem('jwtToken'));

  }
  handleContentSuccess() {

  }
  handleContentFailure() {

  }
  componentDidMount() {
    if(sessionStorage.getItem('jwtToken')) {
      if(!isTokenExpired(sessionStorage.getItem('jwtToken'))) {
        $.ajax({
          type: 'GET',
          headers: {
            'x-access-token': sessionStorage.getItem('jwtToken'),
          },
          url: postURL + '/content',
          success: this.handleContentSuccess.bind(this),
          error: this.handleContentFailure.bind(this),
          dataType: 'json',
        });
      } else {
        sessionStorage.removeItem('jwtToken');
      }

    } else {
      appHistory.replace('/admin');
    }

  }
	render() {


		return (
			<div>
				<Helmet title='ContentPage' />

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
