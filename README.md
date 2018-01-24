# Delivery SDK for Javascript

## Notification

This is an unofficial SDK for the Kentico Cloud Delivery API. The SDK is currently under development, it is not fully tested and might change without guarantee of backward compatibility.

### Breaking changes

-   (v 0.0.9) It is not possible to request and categorize content in 2 separate steps. This includes: 
    -   In the getContent method the possibility to pass array as the parameter has been removed.
    -   The categorizeContent method is not public anymore.

## About

The purpose of this SDK is to:

-   Deliver complete content for a current view from the Kentico Cloud storage with ease.
-   Simplify the output in order to make it operable for rendering.

All of this happens in a single Promise chain in 3 steps:

1.  Get complete content by calling the `getContent` method that is able to make multiple requests and return a single response.
2.  Simplify the delivered content by getting only values from the complex response with use of the `getValues` method.
3.  Process selected raw values to get them ready to be rendered in a view:
    -   `resolveModularContentInRichText` Rich text elements might contain modular content. This method resolves specified modular content item in specified rich text element according to provided template.

## Installation

```sh
npm install kentico-cloud-delivery-js-sdk
```

## Start

```javascript
var Delivery = require('kentico-cloud-delivery-js-sdk');

// Initialize SDK with Project ID and Preview API Key
var project = new Delivery('28f9fefa0...88bcda2cbd13', 'ew0KICAiYW...iwNCiAgInR5');

// Step 1: Request multiple Kentico Cloud endpoints in one step and get responses categorized by keys of the passing object
project.getContent({
  home: '?system.type=homepage',
  nav: '?system.type=navigation'
})
// Step 2: Get only values from the response and join modular_content values with appropriate data items
.then(project.getValues)
// Step 3: Process values to get them ready to be rendered in a view  
.then(function (data) {
  data = project.resolveModularContentInRichText(data, 'home', 'name_of_rich_text_field', 'codename_of_modular_item', '<div class="template">{elements.label}</div><span>{system.id}</span>');
  return data;
})
// View results
.then(console.log);
```

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Delivery](#delivery)
-   [getContent](#getcontent)
-   [getValues](#getvalues)
-   [resolveModularContentInRichText](#resolvemodularcontentinrichtext)

## Delivery

Initilizes object with its Project ID and Preview API Key that represents a Kentico Cloud project.

**Parameters**

-   `projectID` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Project ID, see details in the Kentico Cloud Developers Hub: <https://developer.kenticocloud.com/docs/using-delivery-api#section-getting-project-id>.
-   `previewKey` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Preview API Key, see details in the Kentico Cloud Developers Hub: <https://developer.kenticocloud.com/docs/preview-content-via-api>.

**Examples**

```javascript
var project = new Delivery('82594550-e25c-8219-aee9-677f600bad53', 'ew0KICAiYWxnIjo...QvV8puicXQ');
```

## getContent

Returns promise with data from Kentico Cloud storage specified by params.

**Parameters**

-   `params` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object that contains filtering url parameters that are used for requesting Kentico Cloud storage. Object properties are names for categories. See details about filtering url parameters: <https://developer.kenticocloud.com/v1/reference#delivery-api>
-   `isPreview` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Flag that controls whether only published or all items should be requested.
-   `cache` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object that defines requests caching with the duration and key properties

**Examples**

```javascript
// returns
// {
//   home: {items: [...]},
//   nav: {items: [...]}
// }
project.getContent({
  home: '?system.type=homepage',
  nav: '?system.type=navigation'
}, true, {
  duration: 10,
  key: 'some_random_key'
})
```

Returns **[promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** with object of responses for each passed parameter from the Kentico Cloud storage.

## getValues

Returns values from content items.
Covers content types: Text, Rich text, Number, Multiple choice, Date & time, Asset, Modular content, URL slug, Taxonomy and supports localization.
For Rich text elements the method covers: Modular content, images and links with value added as "Web URL". For links added as "Content item" the method returns a &lt;a> tag with empty "href" attribute as it is not possible to identify full url from the Kentico Cloud response.
Data of a Modular content which is part of a Rich text element is returned as a &lt;script> tag with data in the JSON format inside. The &lt;script> tag is inserted after the &lt;object> tag which represents position of the Modular content in the default Kentico Cloud response.

**Parameters**

-   `content` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Content items returned from the "getContent" method.

**Examples**

```javascript
// Returns
// {
//   homepage: {
//     items: [{
//       system: {
//         id: '...',
//         name: '...',
//         ...
//       },
//       elements: {
//         page_title: '...',
//         header: '...',
//         logos: [{
//           system: {
//             codename: '...',
//             ...
//           },
//           elements: {
//             image: ['...'],
//             url: '...',
//             ...
//           }
//         }]
//       }
//     }
//   }],
//   blog: {
//     items: [{
//       system: {
//         id: '...',
//         name: '...',
//         ...
//       },
//       elements: {
//         page_title: '...',
//         publish_date: '...',
//         header_image: ['...', '...'],
//         ...
//       }
//     },{
//       system: {
//         id: '...',
//         name: '...',
//         ...
//       },
//       elements: {
//         page_title: '...',
//         publish_date: '...',
//         header_image: ['...', '...'],
//         ...
//       }
//    }],
//    pagination: {
//      skip: ...,
//      limit: ...,
//      count: ...,
//      next_page: '...'
//    }
// }
project.getContent({
  home: '?system.type=homepage',
  blog: '?system.type=blog_post'
})
.then(project.getValues});
```

Returns **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** with structured content items values.

## resolveModularContentInRichText

Returns data containing resolved specified Modular content in specified Rich text element.

**Parameters**

-   `content` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Data from the Kentico Cloud storage processed by the getValues methods.
-   `categoryName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Name of a category that has been passed the getContent of categorizeContent methods.
-   `elementName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Name of field that represents the Rich text element.
-   `modularContentCodeName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Code name of a modular item that is inside of the Rich text element.
-   `template` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Template that gets rendered in the Rich text element. You can render data from the passed content with use of the macros wrapped in { }.

**Examples**

```javascript
project.getContent({
  home: '?system.type=homepage',
  blog: '?system.type=blog_post'
})
.then(project.getValues)
.then((data) => {
  data = project.resolveModularContentInRichText(data, 'home', 'rich_content_with_modular_content', 'myCodeName', '<div class="foo">{elements.label}</div><span>{system.id}</span>');
  return data;
});
```

Returns **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** content with processed Rich text element.
