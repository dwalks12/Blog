export default (oldLocation, newLocation) => {
	if (oldLocation && oldLocation.pathname !== newLocation.pathname && !newLocation.hash) {
		return true;
	}

	if (newLocation.hash) {
		window.setTimeout(
			() => {
				const element = document.querySelector(newLocation.hash);
				element && element.scrollIntoView({block: 'start', behavior: 'smooth'});
			},
			200
		);

		return false;
	}

	return true;
};
