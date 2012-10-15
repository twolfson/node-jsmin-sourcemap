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

// Reversal test for sourcemap -- do all the characters line up?
var sourcemap = require('source-map'),
    charProps = require('char-props'),
    SourceMapConsumer = sourcemap.SourceMapConsumer,
    actualJQuerySourceMap = actualJQuery.sourcemap,
    actualJQueryConsumer = new SourceMapConsumer(actualJQuerySourceMap),
    actualProps = charProps(actualJQueryCode);
    srcProps = charProps(jQuerySrc);

// // Iterate over each of the characters
// var i = 0,
//     len = actualJQueryCode.length,
//     actualChar,
//     actualPosition,
//     expectedPosition,
//     expectedLine,
//     expectedCol,
//     expectedChar;
// for (; i < len; i++) {
//   actualChar = actualJQueryCode.charAt(i);
//   actualPosition = {
//     'line': actualProps.lineAt(i) + 1,
//     'column': actualProps.columnAt(i)
//   };
//   expectedPosition = actualJQueryConsumer.originalPositionFor(actualPosition);
//   expectedLine = expectedPosition.line - 1;
//   expectedCol = expectedPosition.column;
//   expectedChar = srcProps.charAt({
//     'line': expectedLine,
//     'column': expectedCol
//   });
//   var expectedIndex = srcProps.indexAt({
//     'line': expectedLine,
//     'column': expectedCol
//   });

//   // Assert that the actual and expected characters are equal
//   assert.strictEqual(actualChar, expectedChar, 'The sourcemapped character at index ' + i + ' does not match its original character at line ' + expectedLine + ', column ' + expectedCol + '.');
// }

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

// Add reversal test for sourcemap -- do all the characters line up?v
var sourcemap = require('source-map'),
    charProps = require('char-props'),
    SourceMapConsumer = sourcemap.SourceMapConsumer,
    actualJQueryAnd_SourceMap = actualJQueryAnd_.sourcemap,
    actualJQueryAnd_Consumer = new SourceMapConsumer(actualJQueryAnd_SourceMap),
    actualProps = charProps(actualJQueryAnd_Code),
    jQuerySrcProps = charProps(jQuerySrc),
    _SrcProps = charProps(_Src);

// Iterate over each of the characters
var i = 0,
    len = actualJQueryAnd_Code.length,
    actualChar,
    actualPosition,
    srcProps,
    expectedPosition,
    expectedLine,
    expectedCol,
    expectedChar;
for (; i < len; i++) {
  actualChar = actualJQueryAnd_Code.charAt(i);
  actualPosition = {
    'line': actualProps.lineAt(i) + 1,
    'column': actualProps.columnAt(i)
  };
  expectedPosition = actualJQueryAnd_Consumer.originalPositionFor(actualPosition);
  expectedLine = expectedPosition.line - 1;
  expectedCol = expectedPosition.column;
  srcProps = expectedPosition.source === 'jquery.js' ? jQuerySrcProps : _SrcProps;
  expectedChar = srcProps.charAt({
    'line': expectedLine,
    'column': expectedCol
  });
  var expectedIndex = srcProps.indexAt({
    'line': expectedLine,
    'column': expectedCol
  });

  // If the index is not 141405 (line feed between files)
  if (i !== 141405) {
    // Assert that the actual and expected characters are equal
    assert.strictEqual(actualChar, expectedChar, 'The sourcemapped character at index ' + i + ' does not match its original character at line ' + expectedLine + ', column ' + expectedCol + '.');
  }
}

// Log success when done
console.log('Success!');