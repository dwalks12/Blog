import React, { Component } from 'react';
import { css } from '../styling/index.js';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import {styles} from '../styling/AdminStyling';
import { browserHistory } from 'react-router';
import {isTokenExpired, getTokenExpirationDate} from '../helpers/jwtHelper';
import $ from 'jquery';
var bcrypt = require('bcrypt-nodejs');

const CLOUDINARY_UPLOAD_PRESET = 'upload';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/ddaohvlb0/upload';
const URLS = require('../../models/config.js');
const postURL =  URLS.globalUrl;

import appHistory from '../utility/app_history';

export default class AdminPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
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
  componentDidMount() {
    if(sessionStorage.getItem('jwtToken')) {
      if(!isTokenExpired(sessionStorage.getItem('jwtToken'))) {
        appHistory.replace('/contentpage');
      }
    }
  }
  loginSuccess() {
    this.setState({
      success: false,
      loading: false,
      showModal: false,
    });
    appHistory.replace('/contentpage');
  }

  handleLoginSuccess(data) {
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
      var postData = {
        username: this.state.usernameInput,
        password: this.state.passwordInput,
      }
      $.ajax({
        type: 'POST',
        url: postURL + '/login',
        data: postData,
        contentType: 'application/json; charset=utf-8',
        success: this.handleLoginSuccess.bind(this),
        error: this.handleLoginFailure.bind(this),
        dataType: 'json',
      });

    } else {
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
