const helpers = require('./helper');

'use strict';

/* This is a monster helper that iterates through the whole response and transforms it to get only values */
/* getValuesFromResponse returns values for all object properties in returned items */

const getValuesHelper = {

	getValuesFromResponse: (content) => {
		var neededValues = {};

		Object.keys(content).forEach((keyContent, indexContent) => {
			var isContent = true;
			neededValues[keyContent] = {};
			neededValues[keyContent]['items'] = [];

			if (!Array.isArray(content[keyContent]['items'])) {
				let tempObject = JSON.parse(JSON.stringify(content[keyContent]));
				isContent = false;
				content[keyContent]['items'] = [];
				content[keyContent]['items'].push(tempObject);
			}

			content[keyContent]['items'].forEach((item, index) => {
				var tempObject = {};

				Object.keys(item).forEach((keyItem, indexItem) => {
					if (keyItem === 'elements' && isContent) {
						tempObject[keyItem] = {};

						Object.keys(item[keyItem]).forEach((keyElement, indexElement) => {
							var itemType = item[keyItem][keyElement].type;

							if (itemType !== 'modular_content') {
								if (itemType === 'asset') {
									tempObject[keyItem][keyElement] = helpers.getArrayValues(tempObject[keyItem][keyElement], item[keyItem][keyElement], 'url');
								} else if (itemType === 'multiple_choice' || itemType === 'taxonomy') {
									tempObject[keyItem][keyElement] = helpers.getArrayValues(tempObject[keyItem][keyElement], item[keyItem][keyElement], 'codename');
								} else if (itemType === 'rich_text' && item[keyItem][keyElement].modular_content.length > 0) {
									tempObject[keyItem][keyElement] = helpers.getRichTextModularContent(item[keyItem][keyElement], content[keyContent]['modular_content']);
								} else {
									tempObject[keyItem][keyElement] = item[keyItem][keyElement].value;
								}
							} else {
								tempObject[keyItem][keyElement] = [];
								item[keyItem][keyElement].value.forEach((itemModular, indexModular) => {
									var tempModularObject = {};

									Object.keys(content[keyContent]['modular_content'][itemModular]).forEach((keyModularItem, indexModularItem) => {

										if (keyModularItem === 'system') {
											tempModularObject[keyModularItem] = content[keyContent]['modular_content'][itemModular][keyModularItem];
										}

										if (keyModularItem === 'elements') {
											tempModularObject[keyModularItem] = {};

											Object.keys(content[keyContent]['modular_content'][itemModular][keyModularItem]).forEach((keyModularContentItem, indexModularContentItem) => {
												var itemType = content[keyContent]['modular_content'][itemModular][keyModularItem][keyModularContentItem].type;

												if (itemType === 'asset') {
													tempModularObject[keyModularItem][keyModularContentItem] = helpers.getArrayValues(tempModularObject[keyModularItem][keyModularContentItem], content[keyContent]['modular_content'][itemModular][keyModularItem][keyModularContentItem], 'url');
												} else if (itemType === 'multiple_choice' || itemType === 'taxonomy') {
													tempModularObject[keyModularItem][keyModularContentItem] = helpers.getArrayValues(tempModularObject[keyModularItem][keyModularContentItem], content[keyContent]['modular_content'][itemModular][keyModularItem][keyModularContentItem], 'codename');
												} else {
													tempModularObject[keyModularItem][keyModularContentItem] = content[keyContent]['modular_content'][itemModular][keyModularItem][keyModularContentItem].value;
												}
											});
										}

									});
									tempObject[keyItem][keyElement].push(tempModularObject);
								});
							}
						});
					} else {
						tempObject[keyItem] = item[keyItem];
					}

				});
				neededValues[keyContent]['items'].push(tempObject);
			});

			if (content[keyContent]['pagination']) {
				neededValues[keyContent]['pagination'] = content[keyContent]['pagination'];
			}
		});

		return neededValues;
	}
}

module.exports = getValuesHelper;
