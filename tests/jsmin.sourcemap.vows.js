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

// Define all of the commands that a test will use
module.exports = {
  "is debuggable": function (info) {
    var actualCode = info.code.actual;
    fs.writeFileSync('debug.min.js', actualCode, 'utf8');
  },
  "_is debuggable": function (info) {
    return info;
  },
  // Compare minified code to gcc'd counterpart
  "matches its C-minified counterpart": function (info) {
    var code = info.code,
        paths = info.paths,
        srcPaths = JSON.stringify(paths.src);
    assert.strictEqual(code.actual, code.expected, 'Minified ' + srcPaths + ' does not match ' + paths.dest);
  },
  // Generate charProps from sourcemap
  "mapped against its source": function (info) {
    // Localize code items
    var code = info.code,
        input = code.input,
        actual = code.actual,
        actualMap = code.actualMap;

    // Iterate over the input
    var srcPropMap = {};
    input.forEach(function (item) {
      var src = item.src,
          code = item.code;
      srcPropMap[src] = charProps(code);
    });

    // Generate a consumer and charProps lookups
    info.props = {
      'consumer': new SourceMapConsumer(actualMap),
      'actualProps': charProps(actual),
      'srcPropMap': srcPropMap
    };

    // Return the info
    return info;
  },
  // Assert that each character reverse maps back to its same character
  "matches at all positions": function (info) {
    // Localize test items
    var srcCode = info.code.src,
        actualCode = info.code.actual,
        props = info.props,
        consumer = props.consumer,
        actualProps = props.actualProps,
        srcPropMap = props.srcPropMap,
        breaks = info.breaks || [];

    // Iterate over each of the characters
    var i = 0,
        len = actualCode.length;
    for (; i < len; i++) {
      // Look up the position of our index
      var actualPosition = {
        'line': actualProps.lineAt(i) + 1,
        'column': actualProps.columnAt(i)
      };

      // Grab the position of the item and its fil
      var srcPosition = consumer.originalPositionFor(actualPosition),
          srcFile = srcPosition.source;

      // If we have a source file and we are not at a break spot
      var atBreakSpot = breaks.indexOf(i) > -1;
      if (srcFile && !atBreakSpot) {
        // Grab the srcProps for it
        var srcProps = srcPropMap[srcFile];

        // Lookup the character at the src positions
        var srcLine = srcPosition.line - 1,
            srcCol = srcPosition.column,
            srcChar = srcProps.charAt({
              'line': srcLine,
              'column': srcCol
            });

        // Assert that the actual and expected characters are equal
        var actualChar = actualCode.charAt(i);
        assert.strictEqual(actualChar, srcChar, 'The sourcemapped character at index ' + i + ' does not match its original character at line ' + srcLine + ', column ' + srcCol + '.');
      }
    }
  }
};