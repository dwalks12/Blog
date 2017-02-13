import React, { Component } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import Helmet from 'react-helmet';
import LazyLoad from 'react-lazy-load';
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';
import appHistory from '../utility/app_history';
import $ from 'jquery';
const URLS = require('../../models/config.js');
const postURL = URLS.globalUrl;
export default class Post extends Component {
	static propTypes = {}

	constructor(props) {
		super(props);
    this.state = {
      imageUrl: '',
      title: '',
      body: '',
      preSelectedId: '',
    }
	}
	componentDidMount() {
    var preSelectedId = this.getParameterByName('id');
    if(preSelectedId && preSelectedId.length > 0) {
      this.getBlogPost(preSelectedId);
    }
	}
  getBlogPost(id) {
    $.ajax({
      type: 'GET',
      headers: {
        'x-access-token': sessionStorage.getItem('jwtToken'),
      },
      url: postURL + '/posts/' + id,
      success: this.handleEditSuccess.bind(this),
      error: this.handleEditError.bind(this),
      dataType: 'json',
    });
  }
  handleEditSuccess(data) {

    if(data) {
      this.setState({
        imageUrl: data.imageUrl,
        title: data.title,
        body: data.body,
        preSelectedId: data.id,
      });
    } else {
      appHistory.replace('/404');
    }

  }
  handleEditError(data) {
    console.log('Error fetching blog');
    appHistory.replace('/404');
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
	render() {
		return (
			<div>
				<Helmet title={this.state.title} />

				<div className={css(styles.dealerMetaContainer)}>
					<LazyLoad>
						<img className={css(styles.bannerImage)} src={this.state.imageUrl}/>
					</LazyLoad>
					<h1 className={css(styles.frontHeader)}>{this.state.title}</h1>
					<div className={css(styles.bodyDiv)}>
					<p style={{fontFamily: 'futura', maxWidth: '100%', wordWrap: 'break-word', whiteSpace: 'pre-wrap', textAlign: 'left'}}>{this.state.body}</p>
					</div>
				</div>
			</div>
		);
	}
}

const styles = StyleSheet.create({
	bodyDiv: {
		width: '90%',
		margin: 'auto',
		textAlign: 'center',
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
