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
import {connect} from 'react-redux';
import {getFrontpage, updateFrontpage} from '../actions/actions';
import {merge,swing,rollOut,rotateIn, rotateOut, pulse,shake, flash, bounce, rubberBand, jello} from 'react-animations';
const animation = merge(flash, shake);
const closeanimation = merge(rotateOut, rotateIn);
const CLOUDINARY_UPLOAD_PRESET = 'upload';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/ddaohvlb0/upload';

class ContentPage extends Component {
	static propTypes = {
		data: PropTypes.any,
		openMenu: PropTypes.bool,
		updatedData: PropTypes.any,
	}
	static contextTypes = {
		store: PropTypes.object,
	}
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: props.openMenu,
      title: props.data.length > 0 ? props.data[0].title : '',
      body: props.data.length > 0 ? props.data[0].body : '',
      imageURL: props.data.length > 0 ? props.data[0].imageUrl : '',
      titleEditFieldOpen: false ,
      bodyEditFieldOpen: false,
			loading: false,
			incorrect: false,
			bodyField: true,
			titleField: true,
			imageId: props.data.length > 0 ? props.data[0].imageId : '',
    }
  }
	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		this.setState({
			title: nextProps.data.length > 0 ? nextProps.data[0].title : '',
			body: nextProps.data.length > 0 ? nextProps.data[0].body : '',
			imageURL: nextProps.data.length > 0 ? nextProps.data[0].imageUrl : '',
			imageId: nextProps.data.length > 0 ? nextProps.data[0].imageId : '',
			loading: false,
		});
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
				this.props.getFrontpage();
      } else {
        sessionStorage.removeItem('jwtToken');
      }

    } else {
      appHistory.replace('/admin');
    }
		console.log('how many times here');
  }
  handleTitleChange(title) {
		this.setState({
			title: title.target.value,
			titleField: true,
		});
  }
	handleBodyChange(body) {
		this.setState({
			body: body.target.value,
			bodyField: true,
		});
	}
	submitUpdate() {
		if(!this.state.loading) {
				//update can be processed
				this.setState({
					loading: true,
				});
				const data = {
					imageUrl: this.state.imageURL,
					title: this.state.title,
					body: this.state.body,
					imageId: this.state.imageId,
					id: '1',
				};
				this.props.updateFrontpage(JSON.stringify(data));
				this.props.getFrontpage();

		}
	}
  changeEditText( type) {
    if(type === 'body') {
			this.setState({
				bodyEditFieldOpen: !this.state.bodyEditFieldOpen,
			});
    } else if( type === 'title') {
			this.setState({
				titleEditFieldOpen: !this.state.titleEditFieldOpen,
			});
    }
  }
  onImageDrop(files) {
    console.log(files[0]);
		let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', files[0]);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        //post the url to database.
        this.setState({
          imageURL: response.body.secure_url,
          imageId: files[0].name,
          loading: false,
        });
      }
    });
  }
	checkInputFields() {
		return !(this.props.data.length > 0);
	}
	render() {
		const openCheck = this.checkInputFields();
		const loadingSpinner = this.state.loading && !this.props.updatedData.ok ? <span><img className={css(styles.loading)} src='../images/loading.gif'/></span> : 'Save';
		const currentTitle = this.props.data.length > 0 && this.props.data[0].title !== undefined ? <h1 className={css(styles.frontHeader)}>{this.props.data[0].title}<span><i className="material-icons" onClick={() => this.changeEditText('title')} style={{marginLeft: '15px', cursor: 'pointer'}}>&#xE254;</i></span></h1> : <div></div>;
		const currentBody = this.props.data.length > 0 && this.props.data[0].body !== undefined ? <p style={{fontFamily: 'futura',}}>{this.props.data[0].body}<span><i className="material-icons" onClick={() => this.changeEditText('body')} style={{marginLeft: '15px', cursor: 'pointer'}}>&#xE254;</i></span></p> : <div></div>;
		const bodyTextBox = openCheck || this.state.bodyEditFieldOpen ? <input className={css(styles.bodyTextBox, !this.state.bodyField ? styles.incorrectBorder : '')} value={this.state.body} placeholder={'Enter body here'} onChange={this.handleBodyChange.bind(this)}/> : <div></div>;
		const titleTextBox = openCheck || this.state.titleEditFieldOpen ? <input className={css(styles.bodyTextBox, !this.state.titleField ? styles.incorrectBorder : '')} value={this.state.title} placeholder={'Enter title here'} onChange={this.handleTitleChange.bind(this)}/> : <div></div>;
		const currentImage = this.state.imageURL.length > 0 ? <img className={css(styles.bannerImage)} src={this.state.imageURL}/> : this.props.data.length > 0 && this.props.data[0].imageUrl !== undefined ? <img className={css(styles.bannerImage)} src={this.props.data[0].imageUrl}/> : <p style={{fontFamily: 'futura', fontSize: '20px', marginTop: '170px'}}>{'Add image here'}</p>;
		return (
			<div>
				<Helmet title='ContentPage' />

				<div className={css(styles.dealerMetaContainer)}>
          <h1 className={css(styles.frontHeader)}>{'Click here to change frontpage image'}</h1>
          <Dropzone
            className={css(styles.increasedWidth)}
            multiple={false}
            accept="image/*"
            onDrop={this.onImageDrop.bind(this)}>
            <LazyLoad>
              {currentImage}
            </LazyLoad>
          </Dropzone>
          <div>
          </div>
          <div style={{marginBottom: '15px'}}>
  					{currentTitle}
						{titleTextBox}


          </div>

					{currentBody}
					{bodyTextBox}

				</div>
				<div className={css(styles.carouselContainer)}>
					<div className={css(styles.gridCarText)}>
					</div>
				</div>
				<div className={css(styles.submitButton, this.state.incorrect ? styles.incorrectParams : '')} onClick={() => this.submitUpdate()}>{loadingSpinner}</div>
				<div className={css(styles.paddingTop)}>

				</div>
			</div>
		);
	}
}

export default connect(
	state => ({
		data: state.rootReducer.getFrontpage.data,
		updatedData: state.rootReducer.updateFrontpage.data,
	}),
	dispatch => ({
		getFrontpage: () => {
			dispatch(getFrontpage());
		},
		updateFrontpage: (data) => {
			dispatch(updateFrontpage(data));
		},
	})
)(ContentPage)

const styles = StyleSheet.create({
	incorrectBorder: {
		borderColor: '#ff3324 !important',
	},
  increasedWidth: {
    width: '100%',
    height: '400px',
    borderStyle: 'dashed',
    borderWidth: '5px',
    cursor: 'pointer',
		marginBottom: '20px',
    [`@media (max-width: ${ breakpoints.mdMin }px)`]: {
			width: '80%',
      margin: 'auto',
		},
  },
  bodyTextBox: {
    width: '90%',
    height: '50px',
    textAlign: 'center',
    fontFamily: 'futura',
    fontSize: '20px',
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
	incorrectParams: {
    animationName: shake,
    animationDuration: '0.5s',
    animationIterationCount: '2',
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

});
