import React, { Component, PropTypes } from 'react';
import { StyleSheet, css } from '../styling/index.js';
import Helmet from 'react-helmet';
import LazyLoad from 'react-lazy-load';
import { breakpoints, marginsAtWidth, webFonts } from '../styling/variables';
import {connect} from 'react-redux';
import {getFrontpage} from '../actions/actions';
class FrontPage extends Component {
	static propTypes = {
		data: PropTypes.any,
	}

	constructor(props) {
		super(props);
		this.state = {
			title: props.data.length > 0 ? props.data[0].title : '',
			body: props.data.length > 0 ? props.data[0].body : '',
			imageURL: props.data.length > 0 ? props.data[0].imageUrl : '',
		}
	}
	componentDidMount() {

		this.props.getFrontpage();
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			title: nextProps.data.length > 0 ? nextProps.data[0].title : '',
			body: nextProps.data.length > 0 ? nextProps.data[0].body : '',
			imageURL: nextProps.data.length > 0 ? nextProps.data[0].imageUrl : '',
		});
	}

	render() {
		return (
			<div>
				<Helmet title='Beverly Walker' />

				<div className={css(styles.dealerMetaContainer)}>
					<LazyLoad>
						<img className={css(styles.bannerImage)} src={this.state.imageURL}/>
					</LazyLoad>
					<h1 className={css(styles.frontHeader)}>{this.state.title}</h1>
					<p style={{fontFamily: 'futura',}}>{this.state.body}</p>
				</div>

			</div>
		);
	}
}
export default connect(
	state => ({
		data: state.rootReducer.getFrontpage.data,
	}),
	dispatch => ({
		getFrontpage: () => {
			dispatch(getFrontpage());
		},
	})
)(FrontPage)

const styles = StyleSheet.create({
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
