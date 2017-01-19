import React, { Component } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import Helmet from 'react-helmet';
import LazyLoad from 'react-lazy-load';
import $ from 'jquery';
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';
import appHistory from '../utility/app_history';
import Dropzone from 'react-dropzone';
import request from 'superagent';
const CLOUDINARY_UPLOAD_PRESET = 'upload';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/ddaohvlb0/upload';
//const postURL =  'https://beverlywalker.herokuapp.com'; //'http://localhost:3000';
const URLS = require('../../models/config.js');
const postURL = URLS.globalUrl;
export default class AddPage extends Component {
	static propTypes = {}

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      imageUrl: '',
      success: false,
      stateFile: {},
      imageId: '',
      loading: false,
      submitting: false,
      error: false,
      uploadedFile: {},
    }
  }
  handleContentSuccess() {

  }
  handleContentFailure() {

  }
  componentDidMount() {
    if(sessionStorage.getItem('jwtToken')) {
      console.log('session still valid');
    } else {
      appHistory.replace('/admin');
    }
    var preSelectedId = this.getParameterByName('id');
    if(preSelectedId && preSelectedId.length > 0) {
      console.log(preSelectedId);
    }

  }
  getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  onImageDrop(files) {
    // console.log(files);
    this.setState({
      stateFile: files[0],
    });
    this.canUploadImage(files[0]);
  }
  canUploadImage(file) {
    this.setState({
      success: false,
      loading: true,
    });
    this.handleImageUpload(file);
  }
  handleImageUpload(file) {
    console.log(this.state.stateFile);
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        //post the url to database.
        this.setState({
          imageUrl: response.body.secure_url,
          imageId: file.name,
          loading: false,
        });
      }
    });
  }
  handleBodyChange(event) {
    var text = event.target.value.replace(/\n/g, "<br/>");
    this.setState({body: event.target.value});
  }
  handleTitleChange(event) {

    this.setState({title: event.target.value});
  }
  submitUpload() {
    this.setState({submitting: true,})
    if(this.state.title.length > 0 && this.state.body.length > 0) {
      console.log('uploadable');
      var postData = {
        imageUrl: this.state.imageUrl ? this.state.imageUrl : '',
        imageid: this.state.stateFile.name ? this.state.stateFile.name : '',
        title: this.state.title,
        body: this.state.body,
        createdAt: new Date(),//change this eventually
        id: Math.random().toString(16).slice(2),
      }
      console.log(postData);
      $.ajax({
        type: 'POST',
        url: postURL + '/content',
        headers: {
          'x-access-token': sessionStorage.getItem('jwtToken'),
        },
        data: postData,
        success: this.handlePostSuccess.bind(this),
        error: this.handlePostFailure.bind(this),
        dataType: 'json',
      });
    }
  }
  handlePostSuccess(data) {
    console.log(data);
    //data.id to get the id of the specific blog.
    if(data) {
      this.setState({
        success: true,
        loading: false,
        submitting: false,
      });
    }
  }
  handlePostFailure(error) {
    console.log(error);
    this.setState({error: true, submitting: false});

  }
  removeSuccessView() {
    this.setState({success: false,});
  }
  removeErrorView() {
    this.setState({error: false,});
  }
	render() {
    const loadingSpinner = this.state.loading || this.state.submitting ? <span><img className={css(styles.loading)} src='../images/loading.gif'/></span> : 'Upload';
    const successDiv = this.state.success ? <div onClick={() => this.removeSuccessView() } style={{width: '300px', height: '100px', position: 'absolute', right: '0', top: '80px', backgroundColor: 'rgba(141, 198, 63, 0.8)', cursor: 'pointer', boxShadow: 'rgba(0, 0, 0, 0.5) 2px 2px 2px'}}><p style={{color: 'white', fontFamily: 'futura', fontSize: '20px', paddingLeft: '10px', paddingRight: '10px'}}>{'Successfully uploaded new blog post'}</p></div> : <div></div>
    const errorDiv = this.state.error ? <div onClick={() => this.removeErrorView() } style={{width: '300px', height: '100px', position: 'absolute', right: '0', top: '80px', backgroundColor: 'rgba(187, 32, 36, 0.8)', cursor: 'pointer', boxShadow: 'rgba(0, 0, 0, 0.5) 2px 2px 2px'}}><p style={{color: 'white', fontFamily: 'futura', fontSize: '20px', paddingLeft: '10px', paddingRight: '10px'}}>{'There was an error uploading post'}</p></div> : <div></div>
    //error color: rgba(187, 32, 36, 0.8)
    const showImage = this.state.imageUrl ? <img className={css(styles.downloadedImage)} src={this.state.imageUrl} /> : <p style={{marginBottom: '20px', fontFamily: 'futura'}} className={css(styles.centerAlign)}>{'Drop your image here or click here to select a file to upload.'}</p>
		return (
			<div>
				<Helmet title='ContentPage' />
        <div className={css(styles.dealerMetaContainer)}>
          {successDiv}
          {errorDiv}
          <h1 className={css(styles.frontHeader)}>{'Add an image here'}</h1>
          <div className={css(styles.imageDropArea)}>
  				<Dropzone
            className={css(styles.increasedWidth)}
            multiple={false}
            accept="image/*"
            onDrop={this.onImageDrop.bind(this)}>
            {showImage}

          </Dropzone>
          </div>
          {/* insert drop image here/ import */}
        </div>
				<div className={css(styles.dealerMetaContainer)}>
					<h1 className={css(styles.frontHeader)}>{'Title'}</h1>
          <div>
            <input className={css(styles.titleTextBox)} placeholder={'Enter a title for this blog post'} value={this.state.title} onChange={this.handleTitleChange.bind(this)}/>
          </div>
					{/*insert text box here */}
				</div>
				<div className={css(styles.dealerMetaContainer)}>
          <h1 className={css(styles.frontHeader)}>{'Content'}</h1>
          <div>
            <textarea className={css(styles.bodyTextBox)} placeholder={'Enter body text here'} value={this.state.body} onChange={this.handleBodyChange.bind(this)}/>
          </div>
          {/* insert text box here */ }
        </div>
        <div style={{pointerEvents: this.state.loading ? 'none' : 'all' }} className={css(styles.submitButton)} onClick={() => this.submitUpload()}>{loadingSpinner}</div>
			</div>
		);
	}
}

const styles = StyleSheet.create({
  downloadedImage: {
    objectFit: 'cover',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
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
  bodyTextBox: {
    width: '80%',
    height: '400px',
    textAlign: 'center',
    fontFamily: 'futura',
    fontSize: '20px',
    cursor: 'pointer',
    borderWidth: '3px',
  },
  titleTextBox: {
    width: '80%',
    height: '50px',
    textAlign: 'center',
    fontFamily: 'futura',
    fontSize: '30px',
    cursor: 'pointer',
    borderWidth: '3px',
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
		height: 'auto',
		width: 'auto',
		maxHeight: '600px',
		[`@media (max-width: ${ breakpoints.mdMin }px)`]: {
			width: '100%',
      margin: 'auto',
		},
	},
  loading: {
    width: '30px',
    height: '30px',
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
  centerAlign: {
    margin: 'auto',
    marginTop: '70px',
    width: '80%',
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

});
