import React, { Component, PropTypes } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import Helmet from 'react-helmet';
import LazyLoad from 'react-lazy-load';
import $ from 'jquery';
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';
import appHistory from '../utility/app_history';
const URLS = require('../../models/config.js');
const postURL = URLS.globalUrl;
import {isTokenExpired, getTokenExpirationDate} from '../helpers/jwtHelper';
import {fetchPages} from '../actions/actions';
export default class BlogPost extends Component {
	static propTypes = {
    postId: PropTypes.string,
  }
  static contextTypes = {
    store: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      blogPosts: [],
    }
    //console.log('the session token is ', sessionStorage.getItem('jwtToken'));

  }

  componentDidMount() {
    const {store} = this.context;
    if(sessionStorage.getItem('jwtToken')) {
      if(!isTokenExpired(sessionStorage.getItem('jwtToken'))) {
        store.dispatch(fetchPages()).then(() => {
          var data = store.getState().rootReducer.getPages.data;
          // console.log(data);
          this.setState({
            blogPosts: data,
          })
        })
      } else {
        sessionStorage.removeItem('jwtToken');
      }

    } else {
      appHistory.replace('/admin');
    }

  }
  componentWillUnmount() {
    this.setState({
      blogPosts: [],
    })
  }
  editBlogPost(id) {
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
    appHistory.replace('/contentpage/addPage?id=' + data.id);
  }
  handleEditError() {

  }
  deleteBlogPost(id, index) {
    $.ajax({
      type: 'DELETE',
      headers: {
        'x-access-token': sessionStorage.getItem('jwtToken'),
      },
      url: postURL+ '/posts/' + id,
      success: this.handleDeleteSuccess.bind(this, index),
      error: this.handleDeleteError.bind(this),
      dataType: 'json',
    });
  }
  handleDeleteSuccess(theIndex) {
    var tempArray = this.state.blogPosts.filter(function(el, index) {
      return index !== theIndex;
    });
    this.setState({
      blogPosts: tempArray,
    });
  }
  handleDeleteError() {
    console.log('blog delete error');
  }
	render() {
    const blogs = this.state.blogPosts.length > 0 ? this.state.blogPosts.map((item, index) => {
      return (<div className={css(styles.blogItem)} key={item.id}>
              <LazyLoad>
                <img className={css(styles.blogImage)} src={item.imageUrl} key={item.imageid} />
              </LazyLoad>
              <h1 key={item.id + '-title'} >{item.title}</h1>
              <p key={item.id + '-body'} style={{maxWidth: '400px', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}>{item.body}</p>
              <div key={item.id + '-delete'} style={{cursor: 'pointer'}} onClick={() => this.deleteBlogPost(item.id, index)}>{'Delete '}<i className="material-icons">&#xE872;</i></div>
              <div key={item.id + '-edit'} style={{cursor: 'pointer'}} onClick={() => this.editBlogPost(item.id, index)}>{'Edit '}<i className="material-icons">&#xE254;</i></div>
        </div>);
    }) : <div></div>;

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
				<div className={css(styles.blogGrid)}>
          {blogs}
				</div>
			</div>
		);
	}
}

const styles = StyleSheet.create({
  blogGrid: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'wrap',
    fontFamily: 'futura',
  },
  blogItem: {
    maxWidth: '400px',
    margin: '10px',
  },
  blogImage: {
    maxWidth: '400px',
    height: 'auto',
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
