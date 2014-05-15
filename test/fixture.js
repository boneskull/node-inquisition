'use strict';

var chai = require('chai');

global.expect = chai.expect;
global.sinon = require('sinon');
global.RequireSubvert = require('require-subvert');

chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));

global.fixture = {
  beforeEach: function beforeEach() {
    global.sandbox = sinon.sandbox.create();
  },
  afterEach: function afterEach() {
    global.sandbox.restore();
  }
};
