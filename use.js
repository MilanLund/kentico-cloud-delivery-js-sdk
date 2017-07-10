var Delivery = require('./index');
const util = require('util');

var project = new Delivery('28f9fefa-3686-402a-9379-88bcda2cbd13');

project.getContentAsPromise(['?system.type=navigation', '?system.type=homepage'])
.then(function (data) {
  return project.categorizeContent(data, ['navigation', 'homepage']);
}).then(function (data) {
  return project.getNeededValues(data, {
    navigation: {
      elements: [{
        name: 'navigation_items',
        elements: ['label', 'is_hidden', 'songs']
      }]
    },
    homepage: {
      elements: ['choice', 'date', 'songs', 'slug']
    }
  });
})
.then(function (data) {
  console.log(util.inspect(data, false, null));
});
