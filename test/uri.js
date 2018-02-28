const isUrl = require('valid-url'),
	expect = require('chai').expect;

const httpsLink = 'https://upload.wikimedia.org/wikipedia/commons/a/a0/11_На_перевале_Гумбаши.JPG';
const httpLink = 'http://upload.wikimedia.org/wikipedia/commons/a/a0/11_На_перевале_Гумбаши.JPG';

describe('Source type destinction', function () {
	describe('URL', function () {
		it('link', function () {
			expect(isUrl.isUri(encodeURI(httpsLink))).to.be.ok;
			expect(isUrl.isUri(encodeURI(httpLink))).to.be.ok;
		});
		it('https', function () {
			expect(isUrl.isHttpsUri(encodeURI(httpsLink))).to.be.ok;
		});
	});
});
