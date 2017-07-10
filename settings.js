module.exports = {
  getDeliveryUrl: (projectID, isPreview) => {
    if (isPreview) {
      return 'https://preview-deliver.kenticocloud.com/' + projectID + '/items';
    } else {
      return 'https://deliver.kenticocloud.com/' + projectID + '/items';
    }
  }
};
