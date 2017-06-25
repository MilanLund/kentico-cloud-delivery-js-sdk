module.exports = {
  getDeliveryUrl: (projectID) => {
    return 'https://deliver.kenticocloud.com/' + projectID + '/items';
  }
};
