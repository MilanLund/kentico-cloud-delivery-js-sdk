var testObject = {
    testItemsParent: {
        items: [{
            system: {
                id: '5d34d964-b473-4554-8f12-86822a149511',
                name: 'Automated test 1',
                codename: 'automated_test_1',
                language: 'en',
                type: 'automated_test',
                sitemap_locations: [],
                last_modified: '2017-07-19T05:47:57.1032663Z'
            },
            elements: {
                text: {
                    type: 'text',
                    name: 'Text',
                    value: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu.'
                },
                rich_text: {
                    type: 'rich_text',
                    name: 'Rich text',
                    images: {
                        ekl0: {
                            image_id: 'ekl0',
                            description: null,
                            url: 'https://assets.kontent.ai:443/28f9fefa-3686-402a-9379-88bcda2cbd13/1c5cc7f2-526f-42e5-965c-bd3853c0bd52/svatebni-2.jpg'
                        }
                    },
                    links: {},
                    modular_content: ['rich_text_modular_item'],
                    value: '<h1>Class aptent</h1>\n<p>&nbsp;Taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.&nbsp;</p>\n<figure data-image-id="ekl0"><img src="https://assets.kontent.ai:443/28f9fefa-3686-402a-9379-88bcda2cbd13/1c5cc7f2-526f-42e5-965c-bd3853c0bd52/svatebni-2.jpg" alt="" data-image-id="ekl0"></figure>\n<p>Mauris dolor felis, sagittis at, luctus sed, aliquam non, tellus. Cras pede libero, dapibus nec, pretium sit amet, tempor quis. Nullam sapien sem, ornare ac, nonummy non, lobortis a enim.</p>\n<object type="application/kenticocloud" data-type="item" data-codename="rich_text_modular_item"></object>'
                },
                number: {
                    type: 'number',
                    name: 'Number',
                    value: 8.632
                },
                multiple_choice: {
                    type: 'multiple_choice',
                    name: 'Multiple choice',
                    value: [{
                        name: 'Option 2',
                        codename: 'option_2'
                    }]
                },
                date___time: {
                    type: 'date_time',
                    name: 'Date & time',
                    value: '2020-11-07T00:00:00Z'
                },
                asset: {
                    type: 'asset',
                    name: 'Asset',
                    value: [{
                            name: 'svatebni-1.jpg',
                            type: 'image/jpeg',
                            size: 63117,
                            description: null,
                            url: 'https://assets.kontent.ai:443/28f9fefa-3686-402a-9379-88bcda2cbd13/802251de-f9c9-4182-b917-aeb4c9489119/svatebni-1.jpg'
                        },
                        {
                            name: 'svatebni-3.jpg',
                            type: 'image/jpeg',
                            size: 43659,
                            description: null,
                            url: 'https://assets.kontent.ai:443/28f9fefa-3686-402a-9379-88bcda2cbd13/b2f9f1ec-89da-4446-b918-72719d6bcbee/svatebni-3.jpg'
                        },
                        {
                            name: 'svatebni-2.jpg',
                            type: 'image/jpeg',
                            size: 44770,
                            description: null,
                            url: 'https://assets.kontent.ai:443/28f9fefa-3686-402a-9379-88bcda2cbd13/ae91a070-f165-4e6f-9e21-2e57514a38d7/svatebni-2.jpg'
                        }
                    ]
                },
                modular_content: {
                    type: 'modular_content',
                    name: 'Modular content',
                    value: ['automated_item_1', 'automated_item_2', 'automated_item_3']
                }
            }
        }],
        modular_content: {
            rich_text_modular_item: {
                system: {
                    id: '2e3d01a9-e9b4-4886-abbb-93eeff3df05e',
                    name: 'Rich text modular item',
                    codename: 'rich_text_modular_item',
                    language: 'en',
                    type: 'automated_test_item',
                    sitemap_locations: [],
                    last_modified: '2017-07-19T05:45:52.4387218Z'
                },
                elements: {
                    text: {
                        type: 'text',
                        name: 'Text',
                        value: 'Morbi scelerisque luctus velit.'
                    }
                }
            },
            automated_item_1: {
                system: {
                    id: '7ac5dcdd-339d-4282-9b98-7f2ee5903aeb',
                    name: 'Automated item 1',
                    codename: 'automated_item_1',
                    language: 'en',
                    type: 'automated_test_item',
                    sitemap_locations: [],
                    last_modified: '2017-07-19T05:47:12.7438657Z'
                },
                elements: {
                    text: {
                        type: 'text',
                        name: 'Text',
                        value: 'Maecenas sollicitudin.'
                    }
                }
            },
            automated_item_2: {
                system: {
                    id: '63ee50f3-48aa-47cb-980e-bd0e4dfbf4ff',
                    name: 'Automated item 2',
                    codename: 'automated_item_2',
                    language: 'en',
                    type: 'automated_test_item',
                    sitemap_locations: [],
                    last_modified: '2017-07-19T05:47:45.905508Z'
                },
                elements: {
                    text: {
                        type: 'text',
                        name: 'Text',
                        value: 'Phasellus rhoncus.'
                    }
                }
            },
            automated_item_3: {
                system: {
                    id: '6b84b73a-9e13-43ca-9f89-2f47ad9e7a53',
                    name: 'Automated item 3',
                    codename: 'automated_item_3',
                    language: 'en',
                    type: 'automated_test_item',
                    sitemap_locations: [],
                    last_modified: '2017-07-19T05:47:58.4000197Z'
                },
                elements: {
                    text: {
                        type: 'text',
                        name: 'Text',
                        value: ''
                    }
                }
            }
        },
        pagination: {
            skip: 0,
            limit: 0,
            count: 1,
            next_page: ''
        }
    },
    testItems: {
        items: [{
                system: {
                    id: '7ac5dcdd-339d-4282-9b98-7f2ee5903aeb',
                    name: 'Automated item 1',
                    codename: 'automated_item_1',
                    language: 'en',
                    type: 'automated_test_item',
                    sitemap_locations: [],
                    last_modified: '2017-07-19T05:47:12.7438657Z'
                },
                elements: {
                    text: {
                        type: 'text',
                        name: 'Text',
                        value: 'Maecenas sollicitudin.'
                    }
                }
            },
            {
                system: {
                    id: '63ee50f3-48aa-47cb-980e-bd0e4dfbf4ff',
                    name: 'Automated item 2',
                    codename: 'automated_item_2',
                    language: 'en',
                    type: 'automated_test_item',
                    sitemap_locations: [],
                    last_modified: '2017-07-19T05:47:45.905508Z'
                },
                elements: {
                    text: {
                        type: 'text',
                        name: 'Text',
                        value: 'Phasellus rhoncus.'
                    }
                }
            },
            {
                system: {
                    id: '6b84b73a-9e13-43ca-9f89-2f47ad9e7a53',
                    name: 'Automated item 3',
                    codename: 'automated_item_3',
                    language: 'en',
                    type: 'automated_test_item',
                    sitemap_locations: [],
                    last_modified: '2017-07-19T05:47:58.4000197Z'
                },
                elements: {
                    text: {
                        type: 'text',
                        name: 'Text',
                        value: ''
                    }
                }
            },
            {
                system: {
                    id: '2e3d01a9-e9b4-4886-abbb-93eeff3df05e',
                    name: 'Rich text modular item',
                    codename: 'rich_text_modular_item',
                    language: 'en',
                    type: 'automated_test_item',
                    sitemap_locations: [],
                    last_modified: '2017-07-19T05:45:52.4387218Z'
                },
                elements: {
                    text: {
                        type: 'text',
                        name: 'Text',
                        value: 'Morbi scelerisque luctus velit.'
                    }
                }
            }
        ],
        modular_content: {},
        pagination: {
            skip: 0,
            limit: 0,
            count: 4,
            next_page: ''
        }
    }
}

module.exports = testObject;
