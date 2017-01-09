import { injectStyleOnce } from 'aphrodite/lib/inject';
export { StyleSheet } from 'aphrodite';

export const css = (...styleDefinitions) => {
    // Filter out falsy values from the input, to allow for
    // `css(a, test && c)`
    const validDefinitions = styleDefinitions.filter((def) => def);

    // Break if there aren't any valid styles.
    if (validDefinitions.length === 0) {
        return '';
    }

    const className = validDefinitions.map(s => s._name).join('-o_O-');
    injectStyleOnce(
			className,
			`.${className}`,
      validDefinitions.map(d => d._definition),
			false // useImportant
		);

    return className;
};
