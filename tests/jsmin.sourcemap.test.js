// Basics for testing
var fs = require('fs'),
    assert = require('assert'),
    jsmin = require('../lib/jsmin.sourcemap.js'),
    testFilesDir = __dirname + '/test_files',
    expectedDir = __dirname + '/expected_files';

// Reverse test items
var sourcemap = require('source-map'),
    charProps = require('char-props'),
    SourceMapConsumer = sourcemap.SourceMapConsumer;

describe('jQuery', function () {
  describe('minified and sourcemapped (single)', function () {
    it.skip('matches its C-minified counterpart', function () {
    });
    it.skip('_is debuggable', function () {
    });
    describe('mapped against its source', function () {
      it.skip('matches at all positions', function () {
      });
    });
  });
});

describe('jQuery and Underscore', function () {
  describe('minified and sourcemapped (multi)', function () {
    it.skip('matches its C-minified counterpart', function () {
    });
    it.skip('_is debuggable', function () {
    });
    describe('mapped against its source', function () {
      it.skip('matches at all positions', function () {
      });
    });
  });
});

describe('Multiple files', function () {
  describe('minified and sourcemapped (multi)', function () {
    it.skip('matches its C-minified counterpart', function () {
    });
    it.skip('_is debuggable', function () {
    });
    describe('mapped against its source', function () {
      it.skip('matches at all positions', function () {
      });
    });
  });
});

describe('Multiple nested files', function () {
  describe('minified and sourcemapped (multi)', function () {
    it.skip('matches its C-minified counterpart', function () {
    });
    it.skip('is debuggable', function () {
    });
    describe('mapped against its source', function () {
      it.skip('matches at all positions', function () {
      });
    });
  });
});
