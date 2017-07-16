const helpers = require('./helpers');

'use strict';

var getValuesHelper = {

  getValuesWithConfig: (content, config) => {
    var neededValues = {};

    //Iterate categories
    Object.keys(config).forEach((keyContent, indexContent) => {
      neededValues[keyContent] = {};
      neededValues[keyContent]['items'] = [];

      if (typeof content[keyContent] === 'undefined') {
        return Promise.reject('Given category "' + keyContent + '" seems to be missing an object from Kentico Cloud as it is missing the "items" property.');
      }

      //Iterate all items in category
      content[keyContent]['items'].forEach((item, index) => {
        let tempObject = {};

        //Iterate categories in config object
        Object.keys(config[keyContent]).forEach((keyElement, indexElement) => {

          //Add pagination
          if (keyElement === 'pagination' && config[keyContent][keyElement] === true && typeof neededValues[keyContent]['pagination'] === 'undefined') {
            neededValues[keyContent]['pagination'] = content[keyContent].pagination;
          }

          //Add content
          if (keyElement === 'elements') {
            tempObject[keyElement] = {};

            //Iterate category properties in config object
            config[keyContent][keyElement].forEach((itemElement, indexElement) => {

              //Check for errors
              if (typeof item[keyElement][itemElement] === 'undefined' && typeof itemElement === 'string') {
                return Promise.reject('The "' + itemElement + '" property does not exist in the "' + keyContent + '.items.' + keyElement + '" object. Check your config.');
              }

              if (typeof item[keyElement][itemElement['name']] === 'undefined' && typeof itemElement === 'object') {
                return Promise.reject('The "' + itemElement['name'] + '" property does not exist in the "' + keyContent + '.items.' + keyElement + '" object. Check your config.');
              }

              //Get values according to config
              if (keyElement === 'system') {
                //Copy value directly to the temp object
                tempObject[keyElement][itemElement] = item[keyElement][itemElement];
              }

              if (keyElement === 'elements') {

                if (typeof itemElement === 'string' && item[keyElement][itemElement].type === 'asset') {
                  //Get urls of all assets in a single array and copy them to temp object
                  tempObject[keyElement][itemElement] = helpers.getArrayValues(tempObject[keyElement][itemElement], item[keyElement][itemElement], 'url');
                } else if (typeof itemElement === 'string' && (item[keyElement][itemElement].type === 'multiple_choice' || item[keyElement][itemElement].type === 'taxonomy')) {
                  //Get codenames of all selected options in the multiple choice in a single array and copy them to temp object
                  tempObject[keyElement][itemElement] = helpers.getArrayValues(tempObject[keyElement][itemElement], item[keyElement][itemElement], 'codename');
                } else if (typeof itemElement === 'string' && item[keyElement][itemElement].type === 'rich_text' && item[keyElement][itemElement].modular_content.length > 0) {
                  //Rich text can contain Modular content so get data for each modular contant in the rich text and append <script> tag that contains JSON for the modular content data
                  tempObject[keyElement][itemElement] = helpers.getRichTextModularContent(item[keyElement][itemElement], content[keyContent]['modular_content']);
                } else if (typeof itemElement === 'object' && item[keyElement][itemElement['name']].type === 'modular_content') {
                  tempObject[keyElement][itemElement['name']] = [];

                  //Bring modular content vaules to the temp object
                  //The logic for modular content item is mostly the same as for regular items

                  //Iterate all names of modular items and find their values in the modular_content section
                  item[keyElement][itemElement['name']].value.forEach((itemModular, indexModular) => {
                    var tempModularObject = {};

                    Object.keys(itemElement).forEach((keyModularElement, indexModularElement) => {
                      if (itemElement[keyModularElement] instanceof Array) {
                        tempModularObject[keyModularElement] = {};
                        itemElement[keyModularElement].forEach((itemModularConfig, indexModularConfig) => {
                          //Check for errors
                          if (typeof content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig] === 'undefined') {
                            return Promise.reject('The "' + itemModularConfig + '" property does not exist in the "' + keyContent + '.modular_content.' + itemModular + '.' + keyModularElement + '" object. Check your config.');
                          }

                          //Get values according to config
                          if (keyModularElement === 'system') {
                            tempModularObject[keyModularElement][itemModularConfig] = content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig];
                          }

                          if (keyModularElement === 'elements') {
                            if (content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig].type === 'asset') {
                              tempModularObject[keyModularElement][itemModularConfig] = helpers.getArrayValues(tempModularObject[keyModularElement][itemModularConfig], content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig], 'url');
                            } else if (content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig].type === 'multiple_choice' ||
                              content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig].type === 'taxonomy') {
                              tempModularObject[keyModularElement][itemModularConfig] = helpers.getArrayValues(tempModularObject[keyModularElement][itemModularConfig], content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig], 'codename');
                            } else {
                              tempModularObject[keyModularElement][itemModularConfig] = content[keyContent]['modular_content'][itemModular][keyModularElement][itemModularConfig].value;
                            }
                          }

                        });
                      }
                    });
                    tempObject[keyElement][itemElement['name']].push(tempModularObject);
                  });
                } else {
                  //Copy value directly to the temp object. Covers content types: Text, Rich text, Number, Date & time, URL slug
                  tempObject[keyElement][itemElement] = item[keyElement][itemElement].value;
                }
              }
            });
          }
        });
        neededValues[keyContent]['items'].push(tempObject);
      });
    });
    return neededValues;
  }
}

module.exports = getValuesHelper;
