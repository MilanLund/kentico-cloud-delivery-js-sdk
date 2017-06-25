var settings = require('./settings');
var helpers = require('./helpers');
var request = require('request');
var requestPromise = require('request-promise');
var Promise = require('bluebird');

'use strict';

/**
* Initilizes object with its Project ID that represents a Kentico Cloud project.
* @constructor Delivery
* @param {string} projectID Project ID, see details in the Kentico Cloud Developers Hub: https://developer.kenticocloud.com/docs/using-delivery-api#section-getting-project-id.
* @example
* var project = new Delivery('82594550-e25c-8219-aee9-677f600bad53');
*/
function Delivery(projectID) {
  this.projectID = projectID;
};


/**
* Returns promise with data specified by array of params.
* @method getContentAsPromise
* @param {array} params Url parameters that are used for requesting Kentico Cloud storage.
* @return {promise} Returns promise with array of responses for each passed parameter from the Kentico Cloud storage.
* @example
* // returns [{items: [...]}, {items: [...]}]
* project.getContentAsPromise(['?system.type=navigation', '?system.type=homepage'])
*/
Delivery.prototype.getContentAsPromise = function(params) {
  var options = helpers.getFullDeliveryUrls(params, this.projectID);

  return Promise.map(options, (item) => {
    return requestPromise(item);
  });
};


/**
* Returns object where each content item is assigned to one category according to their position in given arrays. Number of content items and categories must match.
* @method categorizeContent
* @param {array} content Content items returned from the "getContentAsPromise" method.
* @param {array} categories Names of categories.
* @return {object} Returns object where contect items are property values and categories are property name oereder by their position in given arrays.
* @example
* // returns {navigation: {items: [...]}, homepage: {items: [...]}}
* project.getContentAsPromise(['?system.type=navigation', '?system.type=homepage'])
* .then(function (data) {
*   return project.categorizeContent(data, ['navigation', 'homepage']);
* })
*/
Delivery.prototype.categorizeContent = function(content, categories) {
  if (content.length !== categories.length) {
    return Promise.reject('Number of content items and categories must be equal. Current number of content items is '+ content.length +'. Current number of categories is '+ categories.length +'.');
  }

  var categorizedContent = {};
  content.forEach((item, index) => {
    if (typeof categories[index] !== 'string') {
      return Promise.reject('Category must be a string. Category that in not a string is on index '+ index +' and has value of '+ categories[index] +'.');
    }
    categorizedContent[categories[index]] = item;
  });

  return categorizedContent;
};


/**
* Returns values from content items according to given config
* @method getNeededValues
* @param {array} content Categorized content items returned from the "categorizeContent" method.
* @param {object} config Model that descibes values you beed to get from the content parameter.
* @return {object} Returns content items values that are positioned according to the config parameter.
* @example
* // Returns
* // {
* //   homepage: [{
* //     system: {
* //       id: '...',
* //       name: '...'
* //     },
* //     elements: {
* //       page_title: '...',
* //       header: '...',
* //       logos: [{
* //         system: {
* //           codename: '...'
* //         },
* //         elements: {
* //           image: ['...'],
* //           url: '...'
* //         }
* //       }]
* //     }
* //   }],
* //   blog: [{
* //     system: {
* //       id: '...',
* //       name: '...'
* //     },
* //     elements: {
* //       page_title: '...',
* //       publish_date: '...',
* //       header_image: ['...', '...']
* //     },{
* //     system: {
* //       id: '...',
* //       name: '...'
* //     },
* //     elements: {
* //       page_title: '...',
* //       publish_date: '...',
* //       header_image: ['...', '...']
* //     }
* //   }]
* // }
* project.getContentAsPromise(['?system.type=home', '?system.type=blog_post'])
* .then(function (data) {
*   return project.categorizeContent(data, ['hompage', 'blog']);
* }).then(function (data) {
*   return project.getNeededValues(data, {
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
*       elements: ['page_title', 'publish_date', 'header_image']
*     }
*   });
* );
*/
Delivery.prototype.getNeededValues = function(content, config) {
  if (typeof content !== 'object') {
    return Promise.reject('Content must be a categorized object.');
  }

  var neededValues = {};

  Object.keys(config).forEach(function(keyContent, indexContent) {
    neededValues[keyContent] = [];

    content[keyContent]['items'].forEach((item, index) => {
      let tempObject = {};

      Object.keys(config[keyContent]).forEach(function(keyElement, indexElement) {
        tempObject[keyElement] = {};

        config[keyContent][keyElement].forEach((itemElement, indexElement) => {
            if (keyElement === 'system') {
              tempObject[keyElement][itemElement] = item[keyElement][itemElement];
            }

            if (keyElement === 'elements') {
              if (typeof itemElement === 'string' && item[keyElement][itemElement].type === 'asset') {
                tempObject[keyElement][itemElement] = [];
                item[keyElement][itemElement].value.forEach((itemAsset, indexAsset) => {
                  tempObject[keyElement][itemElement].push(itemAsset.url);
                });
              } else if (typeof itemElement === 'object' && item[keyElement][itemElement['name']].type === 'modular_content') {
                tempObject[keyElement][itemElement['name']] = [];

                item[keyElement][itemElement['name']].value.forEach((itemModular, indexModular) => {
                  var tempModularObject = {};

                  Object.keys(itemElement).forEach(function(keyModularElement, indexModularElement) {
                    if (itemElement[keyModularElement] instanceof Array) {
                      tempModularObject[keyModularElement] = {};
                      itemElement[keyModularElement].forEach((itemModularConfig, indexModularConfig) => {

                        if (keyModularElement === 'system') {
                          tempModularObject[keyModularElement][itemModularConfig] = content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig];
                        }

                        if (keyModularElement === 'elements') {
                          if (content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig].type === 'asset') {
                            tempModularObject[keyModularElement][itemModularConfig] = [];
                            content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig].value.forEach((itemAsset, indexAsset) => {
                              tempModularObject[keyModularElement][itemModularConfig].push(itemAsset.url);
                            });
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
                tempObject[keyElement][itemElement] = item[keyElement][itemElement].value;
              }
            }
          });
      });
      neededValues[keyContent].push(tempObject);
    });
  });
  return neededValues;
};


module.exports = Delivery;
