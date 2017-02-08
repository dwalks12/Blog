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
import {fetchPages} from '../actions/actions';
class Blogs extends Component {
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

    this.props.fetchPages();

  }
  componentWillUnmount() {
    this.setState({
      blogPosts: [],
    })
  }
  editBlogPost(id) {
    this.props.editPage(id);
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
      return (<a style={{cursor: 'pointer', textDecoration: 'none', color: 'black'}} href={postURL + '/#/post?id=' + item.id}><div className={css(styles.blogItem)} key={item.id}>
              <LazyLoad>
                <img className={css(styles.blogImage)} src={item.imageUrl} key={item.imageid} />
              </LazyLoad>
              <h1 key={item.id + '-title'} >{item.title}</h1>
              <p key={item.id + '-body'} style={{maxWidth: '400px', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}>{item.body}</p>
        </div></a>);
    }) : <div></div>;

		return (
			<div>
				<Helmet title='ContentPage' />

				<div className={css(styles.dealerMetaContainer)}>
					<h1 className={css(styles.frontHeader)}>{'Blogs'}</h1>
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
  }),
  dispatch => ({
    fetchPages: () => {
      dispatch(fetchPages());
    },
  })
)(Blogs)

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
