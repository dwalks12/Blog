import React, { Component } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { browserHistory } from 'react-router'
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';
import {merge,swing,rollOut,rotateIn, rotateOut, pulse,shake, flash, bounce, rubberBand, jello} from 'react-animations';
import $ from 'jquery';
var bcrypt = require('bcrypt-nodejs');
const animation = merge(flash, shake);
const closeanimation = merge(rotateOut, rotateIn);
const CLOUDINARY_UPLOAD_PRESET = 'upload';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/ddaohvlb0/upload';
//const postURL =  'https://beverlywalker.herokuapp.com'; //'http://localhost:3000'; for local testing.
const URLS = require('../../models/config.js');
const postURL = process.env.NODE_ENV === 'production' ? URLS.globalUrl : URLS.testUrl;
import appHistory from '../utility/app_history';

export default class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFileCloudinaryUrl: '',
      success: false,
      loading: false,
      usernameInput: '',
      passwordInput: '',
      incorrect: false,
      showModal: true,
      stateFile: {},
    };
  }
  loginSuccess() {
    this.setState({
      success: false,
      loading: false,
      showModal: false,
    });

    appHistory.replace('/content');
    //go to new page
  }

  handleLoginSuccess(data) {
    console.log(data.token);
    console.log(data);
    if(data) {

      sessionStorage.setItem('jwtToken', data.token);
      this.loginSuccess();
    }
  }
  handleLoginFailure(error) {
    this.setState({
      incorrect: true,
      loading: false,
    });
    var that = this;
    setTimeout(function(){
      that.setState({
        incorrect: false,
      });
    }, 800);
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
    this.setState({
      loading: true,
    });
    if(this.state.usernameInput.length > 0 && this.state.passwordInput.length > 0) {
      // var hashedPassword = bcrypt.hashSync(this.state.passwordInput, null, null, function(err, hash) {
      //             if(err) return 'error';
      //             return hash;
      //           });
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
    });
  }
	render() {
    const loadingSpinner = this.state.loading ? <span><img className={css(styles.loading)} src='../images/loading.gif'/></span> : 'Submit';
    const CheckAuthModal = <section className={css(styles.modalContainer)} style={{display: this.state.showModal ? 'block' : 'none'}}>

      <div className={css(styles.modalContent, this.state.incorrect ? styles.incorrectParams : '')}>
        <div className={css(styles.closeIcon)} onClick={() => this.closeModal()}></div>
        <h1 style={{marginBottom: '20px', marginTop: '25px', fontFamily: 'futura'}}>{'Enter Login Credentials'}</h1>
        <input value={this.state.usernameInput} onChange={this.updateUsernameValue.bind(this)} className={css(styles.inputField)} placeholder={'Username'} type='text'></input>
        <input value={this.state.passwordInput} onChange={this.updatePasswordValue.bind(this)} className={css(styles.inputField)} placeholder={'Password'} type='password'></input>
        <div className={css(styles.submitButton)} onClick={() => this.submitLoginCredentials()}>{loadingSpinner}</div>
      </div>
    </section>
		return (
			<div>
				<Helmet title='Admin'/>
        {CheckAuthModal}
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
    background: 'rgba(0, 0, 0, 1)',
    width: '100%',
    height: '100%',

  },
  loading: {
    width: '30px',
    height: '30px',
  },
  submitButton: {
    fontFamily: 'futura',
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
    fontFamily: 'futura',
    fontSize: '20px',
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
    position: 'relative',
    top: '0%',
    left: '98%',
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
			top: '0%',
		},
    [`@media (max-width: ${ breakpoints.mdMin }px)`]: {
			top: '0%',
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
			width: '85% !important',
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

});
