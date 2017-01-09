import { PropTypes, Component } from 'react';

export const createContextProvider = (key, propType, content) => {
	return (
		class ContextProvider extends Component {
			static propTypes = {
				children: PropTypes.element,
			}

			static childContextTypes = {
				[key]: propType,
			}

			getChildContext() {
				return {
					[key]: content,
				};
			}

			render() {
				return this.props.children;
			}
		}
	);
};

export const blockListKeys = (texts, numOfItems, itemIterator) => {
	let list = [];
	const numItems = parseInt(texts(numOfItems));
	for (let i = 1; i <= numItems; i++ ) {
		list.push(itemIterator + i);
	}
	return list;
};
