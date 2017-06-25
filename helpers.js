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
  }
}
