var Delivery = require('./index');
const util = require('util');

var project = new Delivery('82574550-e45c-4219-abe9-677f600bcd53');

project.getContentAsPromise(['?system.type=home', '?system.type=blog_post'])
.then(function (data) {
  return project.categorizeContent(data, ['homepage', 'blog']);
}).then(function (data) {
  return project.getNeededValues(data, {
    homepage: {
      system: ['id', 'name'],
      elements: ['page_title', 'header', {
        name: 'logos',
        system: ['codename'],
        elements: ['logo', 'url']
      },
      {
        name: 'quotes',
        system: ['type', 'last_modified'],
        elements: ['name', 'photo']
      },
      {
        name: 'newsletter'
      }],
    },
    blog: {
      system: ['id', 'name'],
      elements: ['page_title', 'publish_date', 'header_image']
    }
  });
})
.then(function (data) {
  console.log(util.inspect(data, false, null));
});
