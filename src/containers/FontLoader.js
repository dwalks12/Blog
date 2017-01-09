import { Component, PropTypes } from 'react';
import webFontLoader from 'webfontloader';

export default class App extends Component {
  static propTypes = {
    fonts: PropTypes.object.isRequired,
  }

	componentDidMount() {
		webFontLoader.load(this.props.fonts);
	}

  render() {
    return null;
  }
}
