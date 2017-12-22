
var Delivery = require('../src/index');
const util = require('util');

var project = new Delivery('28f9fefa-3686-402a-9379-88bcda2cbd13', 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAidWlkIjogInVzcl8wdk9GSTkzSDAwQUlXNkwyUlJnZUNEIiwNCiAgImVtYWlsIjogIm1pbGFuLmthY3VyYWtAZ21haWwuY29tIiwNCiAgInByb2plY3RfaWQiOiAiMjhmOWZlZmEtMzY4Ni00MDJhLTkzNzktODhiY2RhMmNiZDEzIiwNCiAgImp0aSI6ICJLLWlmeEU4QXk0RnhiWmgwIiwNCiAgInZlciI6ICIxLjAuMCIsDQogICJnaXZlbl9uYW1lIjogIk1pbGFuIiwNCiAgImZhbWlseV9uYW1lIjogIkx1bmQiLA0KICAiYXVkIjogInByZXZpZXcuZGVsaXZlci5rZW50aWNvY2xvdWQuY29tIg0KfQ.diZFTOB_3Kt7C5UIRWBj2mPXptTb-wnnpxweyypmV4o');

project.getContent({
  home: '?system.type=homepage',
  nav: '?system.type=navigation'
})
.then(project.getValues)
.then(function (data) {
  data = project.resolveModularContentInRichText(data, 'home', 'rich_text', 'denicek', '<div class="test">{elements.label}</div><span>{system.id}</span>');
  data = project.resolveModularContentInRichText(data, 'home', 'rich_text', 'main_navigation', '<div class="test">{elements.slug}</div><span>{system.name}</span>');
  return data;
})
.then(function (data) {
  //console.log(util.inspect(data, false, null));
});

project.getContent(['?system.type=automated_test', '?system.type=automated_test_item'])
.then(function (data) {
  //console.log(util.inspect(data, false, null));
  return project.categorizeContent(data, ['nav', 'sad']);
}).then(project.getValues)
.then(function (data) {
  //console.log(util.inspect(data, false, null));
});

project.getContent({
  testItemsParent: '?system.type=automated_test',
  testItems: '?system.type=automated_test_item'
}, false, {
  duration: 10,
  key: 'xxx'
})
.then(function (data) {
  return project.getValues(data, {
    testItemsParent: {
      system: ['id'],
      elements: ['rich_text', {
        name: 'modular_content',
         system: ['codename'],
         elements: ['text']
       }]
     }
   })
})
.then(function (data) {
  console.log(util.inspect(data, false, null));
});
