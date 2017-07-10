var request = require('request');
var requestPromise = require('request-promise');
var Promise = require('bluebird');
var settings = require('./settings');

module.exports = {
  getRawData: (options) => {
    return Promise.map(options, (item) => {
      return requestPromise(item);
    });
  },

  getFullDeliveryUrls: (params, projectID) => {
    var options = [];

    params.forEach((item) => {
      options.push({
        uri: settings.getDeliveryUrl(projectID) + item,
        json: true
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
