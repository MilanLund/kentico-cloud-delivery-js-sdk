var Delivery = require('../src/index');
const util = require('util');

var project = new Delivery('28f9fefa-3686-402a-9379-88bcda2cbd13', 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAidWlkIjogInVzcl8wdk9GSTkzSDAwQUlXNkwyUlJnZUNEIiwNCiAgImVtYWlsIjogIm1pbGFuLmthY3VyYWtAZ21haWwuY29tIiwNCiAgInByb2plY3RfaWQiOiAiMjhmOWZlZmEtMzY4Ni00MDJhLTkzNzktODhiY2RhMmNiZDEzIiwNCiAgImp0aSI6ICJLLWlmeEU4QXk0RnhiWmgwIiwNCiAgInZlciI6ICIxLjAuMCIsDQogICJnaXZlbl9uYW1lIjogIk1pbGFuIiwNCiAgImZhbWlseV9uYW1lIjogIkx1bmQiLA0KICAiYXVkIjogInByZXZpZXcuZGVsaXZlci5rZW50aWNvY2xvdWQuY29tIg0KfQ.diZFTOB_3Kt7C5UIRWBj2mPXptTb-wnnpxweyypmV4o');

project.getContent(['?system.type=homepage'])
.then(function (data) {
  return project.categorizeContent(data, ['homepage']);
})
.then(project.getValues)
.then(function (data) {
  data = project.resolveModularContentInRichText(data, 'homepage', 'rich_text', 'denicek', '<div class="test">{elements.label}</div><span>{system.id}</span>');
  data = project.resolveModularContentInRichText(data, 'homepage', 'rich_text', 'main_navigation', '<div class="test">{elements.slug}</div><span>{system.name}</span>');
  return data;
})
.then(function (data) {
  console.log(util.inspect(data, false, null));
});
/*
project.getContent(['?system.type=navigation'], true)
.then(function (data) {
  return project.categorizeContent(data, ['home']);
}).then(project.getValues)
.then(function (data) {
  console.log(util.inspect(data, false, null));
});*/
