import React, { Component } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';
import {merge,swing,rollOut,rotateIn, rotateOut, pulse,shake, flash, bounce, rubberBand, jello} from 'react-animations';
import $ from 'jquery';
const animation = merge(flash, shake);
const closeanimation = merge(rotateOut, rotateIn);
const CLOUDINARY_UPLOAD_PRESET = 'upload';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/ddaohvlb0/upload';
const URLS = require('../../models/config.js');
const postURL = URLS.globalUrl;

export default class ImagePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFileCloudinaryUrl: '',
      success: false,
      loading: false,
      usernameInput: '',
      passwordInput: '',
      incorrect: false,
      showModal: false,
      stateFile: {},
    };
  }
  onImageDrop(files) {
    this.setState({
      stateFile: files[0],
      success: false,
      loading: true,
      uploadedFile: files[0],
    });
    this.handleImageUpload(files[0]);



  }
  canUploadImage() {
    this.setState({
      uploadedFile: this.state.stateFile,
      success: false,
      loading: true,
    });
    this.handleImageUpload(this.state.stateFile);
  }
  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        //post the url to database.
        var postData = {
          imageUrl: response.body.secure_url,
          imageid: this.state.uploadedFile.name,
          createdBy: 'Unknown',//change this eventually
        }
        $.ajax({
          type: 'POST',
          headers: {
            'x-access-token': sessionStorage.getItem('jwtToken'),
          },
          url: postURL + '/images',
          data: postData,
          success: this.handlePostSuccess(this),
          error: this.handlePostFailure(this),
          dataType: 'json',
        });

        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url,

        });
      }
    });
  }

  handlePostSuccess(data) {

    if(data) {
      this.setState({
        success: true,
        loading: false,
      });
    }
  }
  handleLoginSuccess(data) {

    if(data) {
      this.canUploadImage();
    }
  }
  handleLoginFailure(error) {
    console.log(error);
    this.setState({
      incorrect: true,
    });
    var that = this;
    setTimeout(function(){
      that.setState({
        incorrect: false,
      });
    }, 800);
  }
  handlePostFailure(error) {
    console.log(error);

  }
  updateUsernameValue(e) {
    this.setState({
      usernameInput: e.target.value,
    });
  }
  updatePasswordValue(e) {
    this.setState({
      passwordInput: e.target.value,
    });
  }
  submitLoginCredentials() {
    if(this.state.usernameInput.length > 0 && this.state.passwordInput.length > 0) {
      var postData = {
        username: this.state.usernameInput,
        password: this.state.passwordInput,
      }
      $.ajax({
        type: 'POST',
        url: postURL + '/login',
        data: postData,
        success: this.handleLoginSuccess.bind(this),
        error: this.handleLoginFailure.bind(this),
        dataType: 'json',
      });

    } else {
      console.log('hello');
      this.setState({
        incorrect: true,
      });
      var that = this;
      setTimeout(function(){
        that.setState({
          incorrect: false,
        });
      }, 800);
    }
  }
  closeModal() {
    this.setState({
      showModal: false,
    })
  }
	render() {
    const loadingSpinner = <div style={{display: this.state.loading ? 'inline-block' : 'none'}} className={css(styles.gradientWrapper)}>{'Uploading Image'}</div>
		return (
			<div>
				<Helmet title='Blog' />
				<div className={css(styles.dealerMetaContainer)}>
					<h1 style={{fontFamily: 'futura'}}>{'Import Your image here'}</h1>
				</div>
        <div className={css(styles.imageDropArea)}>
				<Dropzone
          className={css(styles.increasedWidth)}
          multiple={false}
          accept="image/*"
          onDrop={this.onImageDrop.bind(this)}>
          <p style={{marginBottom: '20px', fontFamily: 'futura'}} className={css(styles.centerAlign)}>{'Drop your image here or click here to select a file to upload.'}</p>
        </Dropzone>
        </div>
        {loadingSpinner}
        <div style={{marginBottom: '20px'}} >
          <p className={css(styles.centered)} style={{display: this.state.success ? 'block' : 'none' }}> {'Image successfully uploaded'}</p>
        </div>
        <div className={css(styles.centered)} style={{display: this.state.success ? 'block' : 'none'}}>
          <img className={css(styles.postedImage)} src={this.state.uploadedFileCloudinaryUrl} />
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
  loading: {
    width: '30px',
    height: '30px',
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
  closeIcon: {
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
	dealerMetaContainer: {
		marginTop: '0.5rem',
		marginBottom: '0',
		marginLeft: 'auto',
		marginRight: 'auto',
		textAlign: 'center',
    [`@media (max-width: ${ breakpoints.mdMin }px)`]: {
			fontSize: '10px',
		},
	},
  spinner: {
    borderRadius: '40px',
    background: 'white',
    width: '80px',
    height: '80px',
  },
  gradientWrapper: {
    animationName: animation,
    animationDuration: '5s',
    animationIterationCount: 'infinite',
    textAlign: 'center',
    margin: 'auto',
    width: '100%',
  },
  increasedWidth: {
    width: '100%',
    height: '200px',
    borderStyle: 'dashed',
    borderWidth: '5px',
    [`@media (max-width: ${ breakpoints.mdMin }px)`]: {
			width: '80%',
      margin: 'auto',
		},
  },
  centered: {
    margin: 'auto',
    marginTop: '70px',
    marginBottom: '70px',
    textAlign: 'center',
  },
  centerAlign: {
    margin: 'auto',
    marginTop: '70px',
    width: '80%',
  },
  postedImage: {
    margin: 'auto',
    textAlign: 'center',
    objectFit: 'cover',
    overflow: 'hidden',
    width: '300px',
    height: '300px',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: '5px',
  },
  imageDropArea: {
    width: '450px',
    height: '200px',
    margin: 'auto',
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '20px',
    cursor: 'pointer',
    [`@media (max-width: ${ breakpoints.mdMin }px)`]: {
      width: '100%',
    },
  },
	bannerImage: {
		height: 'auto',
		width: 'auto',
		maxHeight: '600px',
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
