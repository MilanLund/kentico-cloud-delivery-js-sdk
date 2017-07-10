var Delivery = require('./index');
const util = require('util');

var project = new Delivery('28f9fefa-3686-402a-9379-88bcda2cbd13', 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAidWlkIjogInVzcl8wdk9GSTkzSDAwQUlXNkwyUlJnZUNEIiwNCiAgImVtYWlsIjogIm1pbGFuLmthY3VyYWtAZ21haWwuY29tIiwNCiAgInByb2plY3RfaWQiOiAiMjhmOWZlZmEtMzY4Ni00MDJhLTkzNzktODhiY2RhMmNiZDEzIiwNCiAgImp0aSI6ICJLLWlmeEU4QXk0RnhiWmgwIiwNCiAgInZlciI6ICIxLjAuMCIsDQogICJnaXZlbl9uYW1lIjogIk1pbGFuIiwNCiAgImZhbWlseV9uYW1lIjogIkx1bmQiLA0KICAiYXVkIjogInByZXZpZXcuZGVsaXZlci5rZW50aWNvY2xvdWQuY29tIg0KfQ.diZFTOB_3Kt7C5UIRWBj2mPXptTb-wnnpxweyypmV4o');

project.getContentAsPromise(['?system.type=navigation', '?system.type=homepage'])
.then(function (data) {
  return project.categorizeContent(data, ['navigation', 'homepage']);
}).then(function (data) {
  return project.getValues(data, {
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

project.getContentAsPromise(['?system.type=navigation_item'], true)
.then(function (data) {
  return project.categorizeContent(data, ['navigationItem']);
}).then(function (data) {
  return project.getValues(data, {
    navigationItem: {
      elements: ['label'],
      pagination: true
    }
  });
})
.then(function (data) {
  console.log(util.inspect(data, false, null));
});
