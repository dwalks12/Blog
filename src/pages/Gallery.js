import React, { Component } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import Helmet from 'react-helmet';
import LazyLoad from 'react-lazy-load';
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';
import {merge,swing,rollOut,rotateIn, rotateOut, pulse,shake, flash, bounce, rubberBand, jello} from 'react-animations';
import $ from 'jquery';
const closeanimation = merge(rotateOut, rotateIn);
const animation = merge(rotateOut, rotateIn);
const URLS = require('../../models/config.js');
const postURL = URLS.globalUrl;
//const postURL = 'https://beverlywalker.herokuapp.com'; // for local testing.'http://localhost:3000';//
export default class GalleryPage extends Component {
	static propTypes = {}
  constructor(props) {
    super(props);
    this.state = {
      imageUrls: [],
      modalShow: false,
      imageId: '',
      imageIndex: '',
      usernameInput: '',
      passwordInput: '',
    };

  }
  componentDidMount() {
    this.getImages();
  }

  getImages() {
    $.ajax({
      type: 'GET',
      url: postURL + '/images',
			headers: {
        'x-access-token': sessionStorage.getItem('jwtToken'),
      },
      success: this.handlePostSuccess.bind(this),
      error: this.handlePostError.bind(this),
      dataType: 'json',
    });
  }
  handlePostSuccess(data) {
    if(data.length > 0) {
      var urls = [];
      for(var item in data) {
        urls.push(data[item]);
      }

      this.setState({
        imageUrls: urls,
      });
    }
  }

  handlePostError(err) {

  }

  closeModal() {
    this.setState({
      showModal: false,
    })
  }
  renderImages(images) {
    if(images.length > 0) {
      return images.map((images, index) => (
        <div key={`${index}-div1`}><div key={`${index}-div3`}></div><LazyLoad className={css(styles.marginIt)} height={300} offsetBottom={10}><img className={css(styles.galleryImages)} src={images.imageUrl} key={index} ></img></LazyLoad></div>
      ))
    } else {
      return [];
    }
  }
	render() {
    const images = this.renderImages(this.state.imageUrls);
		return (
			<div>
				<Helmet title='Gallery' />
				<div className={css(styles.centerItems)}>
          {images}
        </div>
				<div className={css(styles.paddingTop)}>
				</div>
			</div>
		);
	}
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'fixed',
    top: '0',
    left: '0',
    overflow: 'auto',
    zIndex: '1000',
    background: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',

  },
  marginIt: {
    margin: '10 10 10 10',
  },
  submitButton: {
    cursor: 'pointer',
    width: '200px',
    height: '40px',
    background: '#4d90fe',
    border: '1px solid #3079ED',
    borderRadius: '2px',
    paddingTop: '10px',
    margin: 'auto',
    textAlign: 'center',
    color: 'white',
    ':hover': {
      background: '#2478FD',
    }
  },
  inputField: {
    borderWidth: '3px',
    margin: 'auto',
    width: '80%',
    height: '80px',
    textAlign: 'center',
    marginBottom: '15px',
    [`@media (max-width: ${ breakpoints.mdMin }px)`]: {
			height: '50px',
		},
  },
  incorrectParams: {
    animationName: shake,
    animationDuration: '0.5s',
    animationIterationCount: '2',
  },
  closeIconLogin: {
    position: 'absolute',
    top: '19%',
    left: '90%',
    display:'block',
    boxSizing:'border-box',
    width:'20px',
    height:'20px',
    borderWidth:'3px',
    borderStyle: 'solid',
    borderColor:'black',
    borderRadius:'100%',
    background: '-webkit-linear-gradient(-45deg, transparent 0%, transparent 46%, white 46%,  white 56%,transparent 56%, transparent 100%), -webkit-linear-gradient(45deg, transparent 0%, transparent 46%, white 46%,  white 56%,transparent 56%, transparent 100%)',
    backgroundColor:'black',
    boxShadow:'0px 0px 5px 2px rgba(0,0,0,0.5)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      animationName: closeanimation,
      animationDuration: '1s',
      animationIterationCount: 'infinite',
    },
    [`@media (max-width: ${ breakpoints.smMin }px)`]: {
			top: '2%',
		},
    [`@media (max-width: ${ breakpoints.mdMin }px)`]: {
			top: '12%',
		},

  },
  modalContent: {
    backgroundColor: '#fefefe',
    margin: '15% auto',
    padding: '20px',
    border: '1px solid #888',
    width: '80%',
    height: '400px',
    textAlign: 'center',
    [`@media (max-width: ${ breakpoints.mdMin }px)`]: {
			width: '100%',
		},
  },
  centerItems: {
    margin: 'auto',
    textAlign: 'center',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  galleryImages: {
    objectFit: 'cover',
    overflow: 'hidden',
    width: '300px',
    height: '300px',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: '5px',
  },
  closeIcon: {
    position: 'absolute',
    display:'block',
    boxSizing:'border-box',
    width:'20px',
    height:'20px',
    borderWidth:'3px',
    borderStyle: 'solid',
    borderColor:'black',
    borderRadius:'100%',
    background: '-webkit-linear-gradient(-45deg, transparent 0%, transparent 46%, white 46%,  white 56%,transparent 56%, transparent 100%), -webkit-linear-gradient(45deg, transparent 0%, transparent 46%, white 46%,  white 56%,transparent 56%, transparent 100%)',
    backgroundColor:'black',
    boxShadow:'0px 0px 5px 2px rgba(0,0,0,0.5)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      animationName: animation,
      animationDuration: '1s',
      animationIterationCount: 'infinite',
    },

  },
	paddingTop: {
		paddingTop: 0,
	},
});
