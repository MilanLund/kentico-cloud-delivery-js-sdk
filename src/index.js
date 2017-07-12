const helpers = require('./helpers'),
      request = require('request'),
      requestPromise = require('request-promise'),
      Promise = require('bluebird');

'use strict';

/**
 * Initilizes object with its Project ID and Preview API Key that represents a Kentico Cloud project.
 * @constructor Delivery
 * @param {string} projectID Project ID, see details in the Kentico Cloud Developers Hub: https://developer.kenticocloud.com/docs/using-delivery-api#section-getting-project-id.
 * @param {string} previewKey Preview API Key, see details in the Kentico Cloud Developers Hub: https://developer.kenticocloud.com/docs/preview-content-via-api.
 * @example
 * var project = new Delivery('82594550-e25c-8219-aee9-677f600bad53', 'ew0KICAiYWxnIjo...QvV8puicXQ');
 */
function Delivery(projectID, previewKey) {
  this.projectID = projectID;
  this.previewKey = typeof previewKey === 'undefined' ? null : previewKey;
};


/**
 * Returns promise with data specified by array of params.
 * @method getContent
 * @param {array} params Filtering url parameters that are used for requesting Kentico Cloud storage. See deatils about filtering url parameters: https://developer.kenticocloud.com/v1/reference#delivery-api
 * @param {boolean} isPreview Flag that controls whether only published or all items should be requested.
 * @return {promise} Returns promise with array of responses for each passed parameter from the Kentico Cloud storage.
 * @example
 * // returns [{items: [...]}, {items: [...]}]
 * project.getContent(['?system.type=navigation', '?system.type=homepage'], false)
 */
Delivery.prototype.getContent = function(params, isPreview) {
  var options = helpers.getFullDeliveryUrls(params, this.projectID, this.previewKey, isPreview);

  return Promise.map(options, (item) => {
    return requestPromise(item);
  });
};


/**
 * Returns object where each content item is assigned to one category according to their position in given arrays. Number of content items and categories must match.
 * @method categorizeContent
 * @param {array} content Content items returned from the "getContent" method.
 * @param {array} categories Names of categories.
 * @return {object} Returns object where content items are property values and categories are property names oreder by their position in given arrays.
 * @example
 * // returns {navigation: {items: [...]}, homepage: {items: [...]}}
 * project.getContent(['?system.type=navigation', '?system.type=homepage'], false)
 * .then(function (data) {
 *   return project.categorizeContent(data, ['navigation', 'homepage']);
 * })
 */
Delivery.prototype.categorizeContent = function(content, categories) {
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
};


/**
 * Returns values from content items according to given config object.
 * Covers content types: Text, Rich text, Number, Multiple choice, Date & time, Asset, Modular content, URL slug, Taxonomy and supports localization.
 * For Rich text elements the method covers: Modular content, images and links with value added as "Web URL". For links added as "Content item" the method returns a <a> tag with empty "href" attribute as it is not possible to identify full url from the Kentico Cloud response.
 * Data of a Modular content which is part of a Rich text element is returned as a <script> tag with data in the JSON format inside. The <script> tag is inserted after the <object> tag which represents position of the Modular content in the default Kentico CLoud response.
 * @method getValues
 * @param {array} content Categorized content items returned from the "categorizeContent" method.
 * @param {object} config Model that descibes values you need to get from the data provided through content parameter.
 * @return {object} Returns content items values that are structured according to the config parameter.
 * @example
 * // Returns
 * // {
 * //   homepage: {
 * //     items: [{
 * //       system: {
 * //         id: '...',
 * //         name: '...'
 * //       },
 * //       elements: {
 * //         page_title: '...',
 * //         header: '...',
 * //         logos: [{
 * //           system: {
 * //             codename: '...'
 * //           },
 * //           elements: {
 * //             image: ['...'],
 * //             url: '...'
 * //           }
 * //         }]
 * //       }
 * //     }
 * //   }],
 * //   blog: {
 * //     items: [{
 * //       system: {
 * //         id: '...',
 * //         name: '...'
 * //       },
 * //       elements: {
 * //         page_title: '...',
 * //         publish_date: '...',
 * //         header_image: ['...', '...']
 * //       }
 * //     },{
 * //       system: {
 * //         id: '...',
 * //         name: '...'
 * //       },
 * //       elements: {
 * //         page_title: '...',
 * //         publish_date: '...',
 * //         header_image: ['...', '...']
 * //       }
 * //    }],
 * //    pagination: {
 * //      skip: ...,
 * //      limit: ...,
 * //      count: ...,
 * //      next_page: '...'
 * //    }
 * // }
 * project.getContent(['?system.type=home', '?system.type=blog_post'], false)
 * .then(function (data) {
 *   return project.categorizeContent(data, ['hompage', 'blog']);
 * }).then(function (data) {
 *   return project.getValues(data, {
 *     homepage: {
 *       system: ['id', 'name'],
 *       elements: ['page_title', 'header', {
 *         name: 'logos',
 *         system: ['codename'],
 *         elements: ['image', 'url']
 *       }]
 *     },
 *     blog: {
 *       system: ['id', 'name'],
 *       elements: ['page_title', 'publish_date', 'header_image'],
 *       pagination: true
 *     }
 *   });
 * );
 */
Delivery.prototype.getValues = function(content, config) {

  /* This is a monster method that iterates through the whole response and transforms it according to given config */

  if (typeof content !== 'object') {
    return Promise.reject('Content must be a categorized object.');
  }

  if (helpers.isEmptyObject(config)) {
    return Promise.reject('Config must be provided.');
  }

  var neededValues = {};

  //Iterate categories
  Object.keys(config).forEach(function(keyContent, indexContent) {
    neededValues[keyContent] = {};
    neededValues[keyContent]['items'] = [];

    if (typeof content[keyContent] === 'undefined') {
      return Promise.reject('Given category "' + keyContent + '" seems to be missing an object from Kentico Cloud as it is missing the "items" property.');
    }

    //Iterate all items in category
    content[keyContent]['items'].forEach((item, index) => {
      let tempObject = {};

      //Iterate categories in config object
      Object.keys(config[keyContent]).forEach(function(keyElement, indexElement) {

        //Add pagination
        if (keyElement === 'pagination' && config[keyContent][keyElement] === true && typeof neededValues[keyContent]['pagination'] === 'undefined') {
          neededValues[keyContent]['pagination'] = content[keyContent].pagination;
        }

        //Add content
        if (keyElement === 'elements') {
          tempObject[keyElement] = {};

          //Iterate category properties in config object
          config[keyContent][keyElement].forEach((itemElement, indexElement) => {

            //Check for errors
            if (typeof item[keyElement][itemElement] === 'undefined' && typeof itemElement === 'string') {
              return Promise.reject('The "' + itemElement + '" property does not exist in the "' + keyContent + '.items.' + keyElement + '" object. Check your config.');
            }

            if (typeof item[keyElement][itemElement['name']] === 'undefined' && typeof itemElement === 'object') {
              return Promise.reject('The "' + itemElement['name'] + '" property does not exist in the "' + keyContent + '.items.' + keyElement + '" object. Check your config.');
            }

            //Get values according to config
            if (keyElement === 'system') {
              //Copy value directly to the temp object
              tempObject[keyElement][itemElement] = item[keyElement][itemElement];
            }

            if (keyElement === 'elements') {

              if (typeof itemElement === 'string' && item[keyElement][itemElement].type === 'asset') {
                //Get urls of all assets in a single array and copy them to temp object
                tempObject[keyElement][itemElement] = helpers.getArrayValues(tempObject[keyElement][itemElement], item[keyElement][itemElement], 'url');
              } else if (typeof itemElement === 'string' && (item[keyElement][itemElement].type === 'multiple_choice' || item[keyElement][itemElement].type === 'taxonomy')) {
                //Get codenames of all selected options in the multiple choice in a single array and copy them to temp object
                tempObject[keyElement][itemElement] = helpers.getArrayValues(tempObject[keyElement][itemElement], item[keyElement][itemElement], 'codename');
              } else if (typeof itemElement === 'string' && item[keyElement][itemElement].type === 'rich_text' && item[keyElement][itemElement].modular_content.length > 0) {
                //Rich text can contain Modular content so get data for each modular contant in the rich text and append <script> tag that contains JSON for the modular content data
                tempObject[keyElement][itemElement] = helpers.getRichTextModularContent(item[keyElement][itemElement], content[keyContent]['modular_content']);
              } else if (typeof itemElement === 'object' && item[keyElement][itemElement['name']].type === 'modular_content') {
                tempObject[keyElement][itemElement['name']] = [];

                //Bring modular content vaules to the temp object
                //The logic for modular content item is mostly the same as for regular items

                //Iterate all names of modular items and find their values in the modular_content section
                item[keyElement][itemElement['name']].value.forEach((itemModular, indexModular) => {
                  var tempModularObject = {};

                  Object.keys(itemElement).forEach(function(keyModularElement, indexModularElement) {
                    if (itemElement[keyModularElement] instanceof Array) {
                      tempModularObject[keyModularElement] = {};
                      itemElement[keyModularElement].forEach((itemModularConfig, indexModularConfig) => {
                        //Check for errors
                        if (typeof content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig] === 'undefined') {
                          return Promise.reject('The "' + itemModularConfig + '" property does not exist in the "' + keyContent + '.modular_content.' + itemModular + '.' + keyModularElement + '" object. Check your config.');
                        }

                        //Get values according to config
                        if (keyModularElement === 'system') {
                          tempModularObject[keyModularElement][itemModularConfig] = content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig];
                        }

                        if (keyModularElement === 'elements') {
                          if (content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig].type === 'asset') {
                            tempModularObject[keyModularElement][itemModularConfig] = helpers.getArrayValues(tempModularObject[keyModularElement][itemModularConfig], content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig], 'url');
                          } else if (content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig].type === 'multiple_choice' ||
                            content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig].type === 'taxonomy') {
                            tempModularObject[keyModularElement][itemModularConfig] = helpers.getArrayValues(tempModularObject[keyModularElement][itemModularConfig], content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig], 'codename');
                          } else {
                            tempModularObject[keyModularElement][itemModularConfig] = content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig].value;
                          }
                        }

                      });
                    }
                  });
                  tempObject[keyElement][itemElement['name']].push(tempModularObject);
                });
              } else {
                //Copy value directly to the temp object. Covers content types: Text, Rich text, Number, Date & time, URL slug
                tempObject[keyElement][itemElement] = item[keyElement][itemElement].value;
              }
            }
          });
        }
      });
      neededValues[keyContent]['items'].push(tempObject);
    });
  });
  return neededValues;
};


module.exports = Delivery;
