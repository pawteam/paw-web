const path = require('path');
const fs = require('fs');
const nodeFetch = require('node-fetch-commonjs');
const url = require('url');

require('browser-env')();
require('./site-wrap.js');

test('Sanity check', () => {
	expect().toBeUndefined();
	expect(null).toBeNull();
	expect(true).toBeTruthy();
	expect(true).toBe(true);
	expect(false).toBeFalsy();
	expect(false).toBe(false);
	expect(1 + 1).toBe(2);
});

describe('getDescription', () => {
	test('Should be a function', () => {
		expect(typeof(window.__PAW.getDescription)).toBe('function');
	});

	test('Should call fetch', done => {
		window.fetch = global.fetch = () => {
			done();
			return Promise.resolve({ text: () => '' });
		};
		window.__PAW.getDescription();
	}, 2000);

	test('Should return the description', done => {
		window.fetch = global.fetch = (fetchUrl, ...etc) => {
			if (fetchUrl.startsWith('http'))
				return nodeFetch(url);
			else if (fetchUrl.startsWith('/'))
				return Promise.resolve({ text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, '../www') + fetchUrl, 'utf8')) });
			else
				return Promise.resolve({ text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, '../www') + '/' + fetchUrl, 'utf8')) });
		};
		window.__PAW.getDescription().then(res => {
			expect(res).toBe(fs.readFileSync(path.resolve(__dirname, '../www/description.html'), 'utf8'));
			done();
		});
	}, 5000);
});
