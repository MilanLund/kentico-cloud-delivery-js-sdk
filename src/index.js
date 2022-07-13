const helpers = require('./helpers/helper'),
	getValuesHelper = require('./helpers/getValuesHelper'),
	request = require('request'),
	requestPromise = require('request-promise'),
	Promise = require('bluebird'),
	cheerio = require('cheerio'),
	mcache = require('memory-cache');

'use strict';

/**
 * Initilizes object with its Project ID and Preview API Key that represents a Kentico Cloud project.
 * @constructor Delivery
 * @param {string} projectID Project ID, see details in the Kentico Cloud Developers Hub: https://developer.kontent.ai/docs/using-delivery-api#section-getting-project-id.
 * @param {string} previewKey Preview API Key, see details in the Kentico Cloud Developers Hub: https://developer.kontent.ai/docs/preview-content-via-api.
 * @example
 * var project = new Delivery('82594550-e25c-8219-aee9-677f600bad53', 'ew0KICAiYWxnIjo...QvV8puicXQ');
 */
class Delivery {
	constructor(projectID, previewKey) {
		this.projectID = projectID;
		this.previewKey = typeof previewKey === 'undefined' ? null : previewKey;
	}


	/**
	 * Returns promise with data from Kentico Cloud storage specified by params.
	 * @method getContent
	 * @param {object} params Object that contains filtering url parameters that are used for requesting Kentico Cloud storage. Object properties are names for categories. See details about filtering url parameters: https://developer.kontent.ai/v1/reference#delivery-api
	 * @param {boolean} isPreview Flag that controls whether only published or all items should be requested.
	 * @param {object} cache Object that defines requests caching with the duration and key properties. The object has the "duration" property (number) which stands for cache invalidation interval in seconds. The "key" property (string) stands for cache key. 
	 * @param {boolean} bypassCache Adds the X-KC-Wait-For-Loading-New-Content header to API calls to bypass Kentico Cloud cache to ensure latest version is returned. Suitable when using webhooks.
	 * @return {promise} with object of responses for each passed parameter from the Kentico Cloud storage.
	 * @example
	 * // returns
	 * // {
	 * //   home: {items: [...]},
	 * //   nav: {items: [...]}
	 * // }
	 * project.getContent({
	 *   home: '?system.type=homepage',
	 *   nav: '?system.type=navigation'
	 * }, true, {
	 *   duration: 10,
	 *   key: 'some_random_key'
	  }, false)
	 */
	getContent(params, isPreview, cache, bypassCache) {
		if (typeof params === 'undefined') {
			Promise.reject('Please, specify the params parameter in the getContent method.');
		}

		var categories = [],
			values = [];

		if (helpers.isObject(params)) {
			Object.keys(params).forEach((key, index) => {
				categories.push(key);
				values.push(params[key]);
			});

			params = values.slice();
		} else {
			Promise.reject('Please, the params parameter must be an object.');
		}

		if (typeof isPreview === 'undefined') {
			isPreview = false;
		}

		var that = this,
			options = helpers.getFullDeliveryUrls(params, this.projectID, this.previewKey, isPreview, bypassCache);

		// Request caching
		if (typeof cache === 'undefined' || cache == null) {
			return helpers.getRawData(options)
				.then((data) => {
					return helpers.categorizeContent(data, categories);
				});
		} else {
			var duration = (isPreview === true ? 1 : cache.duration),
				key = '__express__' + cache.key,
				cachedBody = mcache.get(key);

			if (cachedBody) {
				return Promise.resolve(cachedBody);
			} else {
				return helpers.getRawData(options)
					.then((data) => {
						return helpers.categorizeContent(data, categories);
					})
					.then(helpers.cacheImages)
					.then((data) => {
						mcache.put(key, data, duration * 1000);
						return data;
					});
			}
		}
	}

	/**
	 * Returns values from content items.
	 * Covers content types: Text, Rich text, Number, Multiple choice, Date & time, Asset, Modular content, URL slug, Taxonomy and supports localization.
	 * For Rich text elements the method covers: Modular content, images and links with value added as "Web URL". For links added as "Content item" the method returns a &lt;a&gt; tag with empty "href" attribute as it is not possible to identify full url from the Kentico Cloud response.
	 * Data of a Modular content which is part of a Rich text element is returned as a &lt;script&gt; tag with data in the JSON format inside. The &lt;script&gt; tag is inserted after the &lt;object&gt; tag which represents position of the Modular content in the default Kentico Cloud response.
	 * @method getValues
	 * @param {object} content Content items returned from the "getContent" method.
	 * @return {object} with structured content items values.
	 * @example
	 * // Returns
	 * // {
	 * //   homepage: {
	 * //     items: [{
	 * //       system: {
	 * //         id: '...',
	 * //         name: '...',
	 * //         ...
	 * //       },
	 * //       elements: {
	 * //         page_title: '...',
	 * //         header: '...',
	 * //         logos: [{
	 * //           system: {
	 * //             codename: '...',
	 * //             ...
	 * //           },
	 * //           elements: {
	 * //             image: ['...'],
	 * //             url: '...',
	 * //             ...
	 * //           }
	 * //         }]
	 * //       }
	 * //     }
	 * //   }],
	 * //   blog: {
	 * //     items: [{
	 * //       system: {
	 * //         id: '...',
	 * //         name: '...',
	 * //         ...
	 * //       },
	 * //       elements: {
	 * //         page_title: '...',
	 * //         publish_date: '...',
	 * //         header_image: ['...', '...'],
	 * //         ...
	 * //       }
	 * //     },{
	 * //       system: {
	 * //         id: '...',
	 * //         name: '...',
	 * //         ...
	 * //       },
	 * //       elements: {
	 * //         page_title: '...',
	 * //         publish_date: '...',
	 * //         header_image: ['...', '...'],
	 * //         ...
	 * //       }
	 * //    }],
	 * //    pagination: {
	 * //      skip: ...,
	 * //      limit: ...,
	 * //      count: ...,
	 * //      next_page: '...'
	 * //    }
	 * // }
	 * project.getContent({
	 *   home: '?system.type=homepage',
	 *   blog: '?system.type=blog_post'
	 * })
	 * .then(project.getValues});
	 */
	getValues(content) {
		if (typeof content !== 'object') {
			return Promise.reject('Content must be a categorized object.');
		}

		return getValuesHelper.getValuesFromResponse(content);
	}


	/**
	 * Returns data containing resolved specified Modular content in specified Rich text element.
	 * @method resolveModularContentInRichText
	 * @param {object} content Data from the Kentico Cloud storage processed by the getValues methods.
	 * @param {string} categoryName Name of a category that has been passed the getContent of categorizeContent methods.
	 * @param {string} elementName Name of field that represents the Rich text element.
	 * @param {string} modularContentCodeName Code name of a modular item that is inside of the Rich text element.
	 * @param {string} template Template that gets rendered in the Rich text element. You can render data from the passed content with use of the macros wrapped in { }.
	 * @return {object} content with processed Rich text element.
	 * @example
	 * project.getContent({
	 *   home: '?system.type=homepage',
	 *   blog: '?system.type=blog_post'
	 * })
	 * .then(project.getValues)
	 * .then((data) => {
	 *   data = project.resolveModularContentInRichText(data, 'home', 'rich_content_with_modular_content', 'myCodeName', '<div class="foo">{elements.label}</div><span>{system.id}</span>');
	 *   return data;
	* });
	*/
	resolveModularContentInRichText(content, categoryName, elementName, modularContentCodeName, template) {
		var richTextContent = '';

		content[categoryName].items.forEach((item, index) => {
			if (typeof item.elements[elementName] !== 'undefined') {
				var $ = cheerio.load(item.elements[elementName]);
				var $object = $('object[data-codename="' + modularContentCodeName + '"]')
				var codename = $object.attr('data-codename');
				var data = JSON.parse($object.next('script#' + codename).html());

				var regex = /\{([^}]+)\}/gi;
				var result = [];
				var indices = [];

				while ((result = regex.exec(template))) {
					indices.push(result);

					var objectProperies = result[1].split('.');

					var tempData = data;
					objectProperies.forEach((itemProperties, indexProperties) => {
						tempData = tempData[itemProperties];
					});


					var resolvedString = '';
					if (objectProperies[0] === 'elements') {
						resolvedString = tempData.value;
					} else {
						resolvedString = tempData;
					}

					template = template.replace(result[0], resolvedString);
				}

				$object.next('script#' + codename).remove();
				$object.replaceWith(template);
				item.elements[elementName] = $.html().replace('<html><head></head><body>', '').replace('</body></html>', '');
			}
		});

		return content;
	}
}

module.exports = Delivery;
