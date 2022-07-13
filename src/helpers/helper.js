const request = require('request'),
	requestPromise = require('request-promise'),
	Promise = require('bluebird'),
	cheerio = require('cheerio'),
	imageCache = require('image-cache');

'use strict';

const helper = {
	getRawData: (options) => {
		return Promise.map(options, (item) => {
			return requestPromise(item);
		});
	},

	getDeliveryUrl: (projectID, isPreview, param) => {
		let suffix = '';

		if (param.indexOf('?') === 0) {
			suffix = '/items'
		}

		if (isPreview) {
			return 'https://preview-deliver.kontent.ai/' + projectID + suffix;
		} else {
			return 'https://deliver.kontent.ai/' + projectID + suffix;
		}
	},

	getFullDeliveryUrls: (params, projectID, previewKey, isPreview, bypassCache) => {
		var options = [],
			headers = {};

		if (bypassCache === true) {
			headers['X-KC-Wait-For-Loading-New-Content'] = 'true';
		}

		if (isPreview && previewKey !== null) {
			headers['Authorization'] = 'Bearer ' + previewKey;
		}

		params.forEach((item) => {
			options.push({
				uri: helper.getDeliveryUrl(projectID, isPreview, item) + item,
				json: true,
				headers: headers
			});
		});
		
		return options;
	},

	getArrayValues: (temp, assets, property) => {
		temp = [];
		assets.value.forEach((item, index) => {
			temp.push(item[property]);
		});

		return temp;
	},

	getRichTextModularContent: (data, modularContent) => {
		var text = data.value;
		var $ = cheerio.load(text);

		data.modular_content.forEach((item, index) => {
			$('object[data-codename="' + item + '"]').after('<script id="' + item + '">' + JSON.stringify(modularContent[item]) + '</script>');
			text = $.html();
		});

		return text.replace('<html><head></head><body>', '').replace('</body></html>', '');
	},

	hasOwnProperty: Object.prototype.hasOwnProperty,

	isEmptyObject: (obj) => {

		// null and undefined are "empty"
		if (obj == null) return true;

		// Assume if it has a length property with a non-zero value
		// that that property is correct.
		if (obj.length > 0) return false;
		if (obj.length === 0) return true;

		// If it isn't an object at this point
		// it is empty, but it can't be anything *but* empty
		// Is it empty?  Depends on your application.
		if (typeof obj !== "object") return true;

		// Otherwise, does it have any properties of its own?
		// Note that this doesn't handle
		// toString and valueOf enumeration bugs in IE < 9
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) return false;
		}

		return true;
	},

	isObject: (val) => {
		if (val === null) { return false; }
		return ((typeof val === 'function') || (typeof val === 'object')) && !(val instanceof Array);
	},

	categorizeContent: (content, categories) => {
		if (content.length !== categories.length) {
			return Promise.reject('Number of content items and categories must be equal. Current number of content items is ' + content.length + '. Current number of categories is ' + categories.length + '.');
		}

		var categorizedContent = {};
		content.forEach((item, index) => {
			if (typeof categories[index] !== 'string') {
				return Promise.reject('Category must be a string. Category that in not a string is on index ' + index + ' and has value of ' + categories[index] + '.');
			}
			categorizedContent[categories[index]] = item;
		});

		return categorizedContent;
	},

	iterateCacheImages: (value) => {
		var valueElements = value['elements'];
		Object.keys(valueElements).forEach((keyImage) => {
			if (value.elements[keyImage].type === 'asset') {
				value.elements[keyImage].value.forEach((valueAsset) => {
					if (valueAsset.type.indexOf('image') > -1) {
						imageCache.setCache(valueAsset.url, (error) => {
							imageCache.getCache(valueAsset.url, (error, image) => {
								valueAsset.url = image.data;
							});
						});
					}
				});
			}

			if (value.elements[keyImage].type === 'rich_text') {
				if (Object.keys(value.elements[keyImage].images).length > 0) {
					var regex = /<img.*?src="(.*?)"/gm,
						images = [],
						match;

					while (match = regex.exec(value.elements[keyImage].value)) {
						images.push(match[1]);
					}

					images.forEach((img) => {
						imageCache.setCache(img, (error) => {
							imageCache.getCache(img, (error, image) => {
								value.elements[keyImage].value = value.elements[keyImage].value.replace(img, image.data);
							});
						});
					});
				}
			}
		});
	},

	cacheImages: (content) => {
		Object.keys(content).forEach((key) => {
			if (typeof content[key]['items'] !== 'undefined') {
				content[key]['items'].forEach((value) => {
					helper.iterateCacheImages(value);
				});
			}

			if (typeof content[key]['modular_content'] !== 'undefined') {
				Object.keys(content[key]['modular_content']).forEach((value) => {
					helper.iterateCacheImages(content[key]['modular_content'][value]);
				});
			}
		});

		return content;
	}
}

module.exports = helper;
