const request = require('request'),
      requestPromise = require('request-promise'),
      Promise = require('bluebird'),
      cheerio = require('cheerio');

'use strict';

var helpers = {
  getRawData: (options) => {
    return Promise.map(options, (item) => {
      return requestPromise(item);
    });
  },

  getDeliveryUrl: (projectID, isPreview) => {
    if (isPreview) {
      return 'https://preview-deliver.kenticocloud.com/' + projectID + '/items';
    } else {
      return 'https://deliver.kenticocloud.com/' + projectID + '/items';
    }
  },

  getFullDeliveryUrls: (params, projectID, previewKey, isPreview) => {
    var options = [];

    if (isPreview && previewKey !== null) {
      params.forEach((item) => {
        options.push({
          uri: helpers.getDeliveryUrl(projectID, isPreview) + item,
          json: true,
          headers: {
            Authorization: 'Bearer ' + previewKey
          }
        });
      });
    } else {
      params.forEach((item) => {
        options.push({
          uri: helpers.getDeliveryUrl(projectID, isPreview) + item,
          json: true
        });
      });
    }
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
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

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
  }
}
3
module.exports = helpers;
