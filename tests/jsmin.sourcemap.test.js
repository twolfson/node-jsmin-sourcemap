var fs = require('fs'),
    assert = require('assert'),
    jsmin = require('../lib/jsmin.sourcemap.js'),
    testFilesDir = __dirname + '/test_files',
    expectedDir = __dirname + '/expected_files',
    jQuerySrc = fs.readFileSync(testFilesDir + '/jquery.js', 'utf8'),
    expectedJQuery = fs.readFileSync(expectedDir + '/jquery.min.js', 'utf8'),
    actualJQuery = jsmin({'code':jQuerySrc,'src':'jquery.js','dest':'jquery.min.js'});

// Assert that the minified jQuery matches the expected version
var actualJQueryCode = actualJQuery.code;
assert.strictEqual(expectedJQuery, actualJQueryCode, 'Minified jQuery does not match as expected.');

// Output to combination file (debug only)
// fs.writeFileSync('debug.min.js', actualJQueryCode, 'utf8');

// TODO: Add reversal test for sourcemap -- do all the characters line up?
var sourcemap = require('source-map'),
    charProps = require('char-props'),
    SourceMapConsumer = sourcemap.SourceMapConsumer,
    actualJQuerySourceMap = actualJQuery.sourcemap,
    actualJQueryConsumer = new SourceMapConsumer(actualJQuerySourceMap),
    actualProps = charProps(actualJQueryCode);
    srcProps = charProps(jQuerySrc);

// Iterate over each of the character (first 100 for starters)
var i = 0,
    len = 100 || actualJQueryCode.length,
    actualChar,
    actualPosition,
    expectedPosition,
    expectedChar;
for (; i < len; i++) {
  actualChar = actualJQueryCode.charAt(i);
  actualPosition = {
    'line': actualProps.lineAt(i) + 1,
    'column': actualProps.columnAt(i) + 1
  };
  expectedPosition = actualJQueryConsumer.originalPositionFor(actualPosition);
  expectedChar = srcProps.charAt({
    'line': expectedPosition.line - 1,
    'column': expectedPosition.column - 1
  });
  // console.log(actualChar, expectedChar);
}

// Grab underscore
var _Src = fs.readFileSync(testFilesDir + '/underscore.js', 'utf8'),
    minParams = {
      'input': [{
        'code': jQuerySrc,
        'src': 'jquery.js'
      }, {
        'code': _Src,
        'src': 'underscore.js'
      }],
      'dest': 'jqueryAndUnderscore.min.js'
    },
    expectedJQueryAnd_Code = fs.readFileSync(expectedDir + '/jqueryAndUnderscore.min.js', 'utf8'),
    actualJQueryAnd_ = jsmin(minParams),
    actualJQueryAnd_Code = actualJQueryAnd_.code;

// Output to combination file (debug only)
// fs.writeFileSync('debug.min.js', actualJQueryAnd_Code, 'utf8');

// Assert that the minified jQuery and underscore matches the expected version
assert.strictEqual(expectedJQueryAnd_Code, actualJQueryAnd_Code, 'Minified jQuery and underscore do not match as expected.');

// TODO: Add reversal test for sourcemap -- do all the characters line up?

// Log success when done
console.log('Success!');