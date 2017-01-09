import React, { Component } from 'react';
import Helmet from 'react-helmet';

// import { Heading, Heading2 } from 'presentational/text';

import { StyleSheet, css } from '../styling/index.js';
import { colors } from '../styling/variables';

export default class FourOhFourPage extends Component {
  render() {
    return (
      <div className={css(styles.container)}>
				<Helmet title='Error 404' />
				<h1 color={colors.orange}>Error 404</h1>
				<h2>The page you are looking for is not found. 🤖</h2>
      </div>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		padding: '2em',
		textAlign: 'center',
	},
});
