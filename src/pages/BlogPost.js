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
import {connect} from 'react-redux';
import {fetchPages, deletePage, editPage} from '../actions/actions';
class BlogPost extends Component {
	static propTypes = {
    postId: PropTypes.string,
    data: PropTypes.any,
  }
  static contextTypes = {
    store: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      blogPosts: props.data ? props.data : [],
    }
    //console.log('the session token is ', sessionStorage.getItem('jwtToken'));

  }

  componentDidMount() {
    const {store} = this.context;
    if(sessionStorage.getItem('jwtToken')) {
      if(!isTokenExpired(sessionStorage.getItem('jwtToken'))) {
        this.props.fetchPages();
        // var data = store.getState().rootReducer.getPages.data;
        // console.log(fetchedPages, data);
        // this.props.fetchPages().then(() => {
        //   var data = store.getState().rootReducer.getPages.data;
        //   // console.log(data);
        //   this.setState({
        //     blogPosts: data,
        //   })
        // })
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

    this.props.editPage(id);

    // $.ajax({
    //   type: 'GET',
    //   headers: {
    //     'x-access-token': sessionStorage.getItem('jwtToken'),
    //   },
    //   url: postURL + '/posts/' + id,
    //   success: this.handleEditSuccess.bind(this),
    //   error: this.handleEditError.bind(this),
    //   dataType: 'json',
    // });
  }
  handleEditSuccess(data) {
    appHistory.replace('/contentpage/addPage?id=' + data.id);
  }
  handleEditError() {

  }
  deleteBlogPost(id, index) {
    this.props.deletePage(id);
    this.props.fetchPages();
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
    const blogs = this.props.data && this.props.data.length > 0 ? this.props.data.map((item, index) => {
      return (<div className={css(styles.blogItem)} key={item.id}>
              <LazyLoad>
                <img className={css(styles.blogImage)} src={item.imageUrl} key={item.imageid} />
              </LazyLoad>
              <h1 key={item.id + '-title'} >{item.title}</h1>
              <p className={css(styles.blogText)} key={item.id + '-body'} style={{maxWidth: '400px'}}>{item.body}</p>
              <a style={{textDecoration: 'none', fontFamily: 'futura'}} href={postURL + '/#/post?id=' + item.id}>Link to blog</a>
              <div key={item.id + '-delete'} style={{cursor: 'pointer'}} onClick={() => this.deleteBlogPost(item.id, index)}>{'Delete '}<i className="material-icons">&#xE872;</i></div>
              <div key={item.id + '-edit'} style={{cursor: 'pointer'}} onClick={() => this.editBlogPost(item.id, index)}>{'Edit '}<i className="material-icons">&#xE254;</i></div>
        </div>);
    }) : <div></div>;

		return (
			<div>
				<Helmet title='ContentPage' />

				<div className={css(styles.dealerMetaContainer)}>
					<h1 className={css(styles.frontHeader)}>{'Blogs'}</h1>
					<p style={{fontFamily: 'futura',}}>{'Here are all your blogs'}</p>
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

export default connect(
  state => ({
    data: state.rootReducer.getPages.data,
    editPage: state.rootReducer.editPage.data,
  }),
  dispatch => ({
    fetchPages: () => {
      dispatch(fetchPages());
    },
    deletePage: (id) => {
      dispatch(deletePage(id));
    },
    editPage: (id) => {
      dispatch(editPage(id));
    }
  })
)(BlogPost)

const styles = StyleSheet.create({
  blogGrid: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'wrap',
    fontFamily: 'futura',
  },
	blogText: {
		overflow: 'hidden',
		position: 'relative',
		lineHeight: '1.4em',
		maxHeight: '4.2em',
		textAlign: 'justify',
		marginRight: '-1em',
		paddingRight: '1em',

		':before': {
			content: '"..."',
			position: 'absolute',
			right: '0',
			bottom: '0',
		},
		':after': {
			content: '""',
			position: 'absolute',
			right: '0',
			width: '1em',
			height: '1em',
			marginTop: '0.2em',
			background: 'white',

		}
	},
  blogItem: {
    maxWidth: '400px',
    margin: '10px',
  },
  blogImage: {
    maxWidth: '400px',
    width: '100%',
    objectFit: 'cover',
    overflow: 'hidden',
    height: '20%',
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
