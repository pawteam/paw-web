if (!window.__PAW)
	window.__PAW = {};

window.__PAW.getDescription = () => {
	return fetch('/description.html').then(res => res.text());
};
