'use strict';

var inq = require('_lib/inquisition'),
  format = require('util').format;

describe('inquisition', function () {

  describe('_toCode()', function () {

    var DUMMY = format('var %s = ', inq._SIGNATURE);

    it('should parse a string', function () {
      expect(inq._toCode('foo')).to.equal(DUMMY + '"foo";');
    });

    it('should parse a number', function () {
      expect(inq._toCode(1)).to.equal(DUMMY + '1;');
    });

    it('should parse null', function () {
      expect(inq._toCode(null)).to.equal(DUMMY + 'null;');
    });

    it('should parse undefined', function () {
      expect(inq._toCode()).to.equal(DUMMY + 'undefined;');
    });

    it('should parse an array', function () {
      expect(inq._toCode([
        1, 2, 3
      ])).to.equal(DUMMY + '[1,2,3];');
    });

    it('should parse an object', function () {
      expect(inq._toCode({foo: 'bar'})).to.equal(DUMMY + '{"foo":"bar"};');
    });

    it('should parse a function', function () {
      expect(inq._toCode(function herp() {
        return 'derp';
      })).to.equal(DUMMY +
          "_$BEGIN_FUNCTION$_function herp() { return 'derp'; }_$END_FUNCTION$_;");
    });

    it('should parse a RegExp, barely', function () {
      expect(inq._toCode(/foo/g)).to.equal(DUMMY + '/foo/g;');
    });

  });

});
