
var Delivery = require('../src/index');
const util = require('util');

var project = new Delivery('55779b69-02dc-438a-a553-dec737af7c0c', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJ1c3JfMHZVSVc5ME50UElTcTZtRkgzdmRYYiIsImVtYWlsIjoiaGVsbG9AbWlsYW5sdW5kLmNvbSIsInByb2plY3RfaWQiOiI1NTc3OWI2OS0wMmRjLTQzOGEtYTU1My1kZWM3MzdhZjdjMGMiLCJqdGkiOiJrV0VQeWZXQkRwN3VvRFg4IiwidmVyIjoiMS4wLjAiLCJnaXZlbl9uYW1lIjoiTWlsYW4iLCJmYW1pbHlfbmFtZSI6Ikx1bmQiLCJhdWQiOiJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSJ9.IpvMLQ46KfsV_avd7er5v_S3Cxa2qubJvfzLrSAAipY');
/*
project.getContent({
  home: '?system.type=homepage',
  nav: '?system.type=navigation',
  taxonomy: '/taxonomies/songs',
  types: '/types/automated_test'
})
.then(project.getValues)
.then(function (data) {
  data = project.resolveModularContentInRichText(data, 'home', 'rich_text', 'denicek', '<div class="test">{elements.label}</div><span>{system.id}</span>');
  data = project.resolveModularContentInRichText(data, 'home', 'rich_text', 'main_navigation', '<div class="test">{elements.slug}</div><span>{system.name}</span>');
  return data;
})
.then(function (data) {
  console.log(util.inspect(data, false, null));
});
*/

project.getContent({
  post: '?system.type[in]=blog_post,article&elements.url_slug=vanocni-cukrovi',
  taxonomy: '/taxonomies/blog_post',
  /*page: '?system.codename=article',
  navigation: '?system.sitemap_locations[contains]=navigation&elements=url,title',
  resourceStrings: '?system.type=resource_string'*/
}, false, {
  duration: 10,
  key: 'xxx'
})
.then(project.getValues)
.then(function (data) {
  console.log(util.inspect(data, false, null));
});
