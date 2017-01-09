export const colors = {
	primary: 'rgb(220,0,46)',
	warning: 'rgb(220,0,46)',
	orange: 'rgb(255, 127, 50)',
	text: 'rgb(64,64,64)',
	textDark: 'black',
	textLight: 'white',
	ctaDefault: '#404040',
	arrowedInfoBoxBackground: 'black',
	arrowedInfoBoxForeground: 'white',
	black70: 'rgb(134,134,137)',
	pageBackground: 'white',
	topMenuBorder: 'rgb(134,134,137)',
	darkGrey: 'rgb(134,134,137)',
	mediumGrey: 'rgb(160, 160, 160)',
};

export const fonts = [
	'futura',
	'gill sans',
	'arial',
	'sans serif',
];

export const ctaFonts = [
	'ubuntu',
	'gill sans',
	'arial',
	'sans serif',
];

export const webFonts = {
	google: {
    families: ['Ubuntu:700'],
  },
	custom: {
		families: ['futura:n4', 'futura:n7'],
	},
};

export const margins = {
	small: 10,
	medium: 10,
	large: 15,
};

export const breakpoints = {
	xsMin: 0,
	xsMax: 414, // Based on iPhone 6 plus

	smMin: 415,
	smMax: 767,

	mdMin: 768,
	mdMax: 999,

	lgMin: 1000,
	lgMax: 1200,

	xlMin: 1201,
};

export const mediaQueries = {
	xs: window.matchMedia(`(max-width: ${breakpoints.xsMax}px)`),
	sm: window.matchMedia(`(min-width: ${breakpoints.smMin}px) and (max-width: ${breakpoints.smMax}px)`),
	md: window.matchMedia(`(min-width: ${breakpoints.mdMin}px) and (max-width: ${breakpoints.mdMax}px)`),
	lg: window.matchMedia(`(min-width: ${breakpoints.lgMin}px) and (max-width: ${breakpoints.lgMax}px)`),
	xl: window.matchMedia(`(min-width: ${breakpoints.xlMin}px)`),
};

export const marginsAtWidth = (width) => {
	if (width <= breakpoints.smMax) {
		return margins.small;
	}

	if (width <= breakpoints.mdMax) {
		return margins.medium;
	}

	return margins.large;
};
