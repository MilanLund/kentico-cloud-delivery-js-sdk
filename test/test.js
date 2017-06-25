var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var Delivery = require('../index');

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

chai.use(chaiAsPromised);
chai.should();

var project = new Delivery('82574550-e45c-4219-abe9-677f600bcd53');

describe('Delivery', function() {
  describe('#Project', function() {
    it('should init project details', function() {
      assert.equal(project.projectID, '82574550-e45c-4219-abe9-677f600bcd53');
    });

    it('promise should be fulfilled', function() {
      return Promise.resolve(project.getContentAsPromise(['?system.type=home'])).should.eventually.fulfilled;
    });

    it('should get content from homepage with promise and check if not empty ', function() {
      return Promise.resolve(project.getContentAsPromise(['?system.type=home']).then(function(data) {return data[0].items})).should.not.eventually.have.length(0);
    });
  });
});
