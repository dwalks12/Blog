import React, { Component, PropTypes } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import Helmet from 'react-helmet';
import LazyLoad from 'react-lazy-load';
import $ from 'jquery';
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';
import appHistory from '../utility/app_history';
import Dropzone from 'react-dropzone';
import request from 'superagent';
const URLS = require('../../models/config.js');
const postURL = URLS.globalUrl;
import {isTokenExpired, getTokenExpirationDate} from '../helpers/jwtHelper';

export default class ContentPage extends Component {
	static propTypes = {}

  constructor(props) {
    super(props);
    this.state = {
      menuOpen: props.openMenu,
      title: '',
    }
  }
  handleContentSuccess() {

  }
  handleContentFailure() {

  }
  componentDidMount() {
    if(sessionStorage.getItem('jwtToken')) {
      if(!isTokenExpired(sessionStorage.getItem('jwtToken'))) {
        this.setState({
          menuOpen: true,
        });
      } else {
        sessionStorage.removeItem('jwtToken');
      }

    } else {
      appHistory.replace('/admin');
    }

  }
  onImageDrop(files) {
    console.log(files[0]);
  }
	render() {


		return (
			<div>
				<Helmet title='ContentPage' />

				<div className={css(styles.dealerMetaContainer)}>
          <h1 className={css(styles.frontHeader)}>{'Click on image to change frontpage image'}</h1>
          <Dropzone
            className={css(styles.increasedWidth)}
            multiple={false}
            accept="image/*"
            onDrop={this.onImageDrop.bind(this)}>
            <LazyLoad>
              <img className={css(styles.bannerImage)} src={'../images/Dawson.png'}/>
            </LazyLoad>
          </Dropzone>

          <div>
            <input className={css(styles.titleTextBox)} placeholder={'Enter a title for the frontpage'} value={this.state.title} onChange={this.handleTitleChange.bind(this)}/>
          </div>
          <div>
  					<h1 className={css(styles.frontHeader)}>{'Dawson Walker'}</h1>
            <p>{'Edit Title'}</p> <i className="material-icons">&#xE254;</i>
          </div>
					<p style={{fontFamily: 'futura',}}>{'A blog of sorts'}</p>
          <div>{'Edit text'}<i className="material-icons">&#xE254;</i></div>
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
  increasedWidth: {
    width: '100%',
    height: '400px',
    borderStyle: 'dashed',
    borderWidth: '5px',
    [`@media (max-width: ${ breakpoints.mdMin }px)`]: {
			width: '80%',
      margin: 'auto',
		},
  },
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
		height: '100%',
		width: '100%',
    objectFit: 'cover',
    overflow: 'hidden',
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
