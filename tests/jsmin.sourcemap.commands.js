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
  "jQuery": function jQueryPaths () {
    return {'paths': {'src': 'jquery.js', 'dest': 'jquery.min.js'}};
  },
  "Multiple files": function jQueryPaths () {
    return {'paths': {'src': ['1.js', '2.js', '3.js'], 'dest': 'multi.js'}};
  },
  "minified and sourcemapped (single)": function (info) {
    // Localize the src and dest
    var filePaths = info.paths,
        src = filePaths.src,
        dest = filePaths.dest;

    // Read in the src file
    var singleSrc = fs.readFileSync(testFilesDir + '/' + src, 'utf8'),
        actualSingle = jsmin({'code': singleSrc, 'src': src, 'dest': dest}),
        expectedSingleCode = fs.readFileSync(expectedDir + '/' + dest, 'utf8');

    // TODO: Use this to for common ground of single and multi
    // var srcFileMap = {};
    // srcFileMap[src] = singleSrc;
    // info.code = {
    //   'src': srcFileMap,

    // Save to the code namespace
    info.code = {
      'src': singleSrc,
      'actual': actualSingle.code,
      'actualMap': actualSingle.sourcemap,
      'expected': expectedSingleCode
    };

    // Return info
    return info;
  },
  "minified and sourcemapped (multi)": function (info) {
    // Localize the src and dest
    var filePaths = info.paths,
        src = filePaths.src,
        dest = filePaths.dest;

    // Read in the src files
    var srcFiles = src.map(function (filepath) {
      var fileSrc = fs.readFileSync(testFilesDir + '/' + filepath, 'utf8'),
          retObj = {
            'code': fileSrc,
            'src': filepath
          };
      return retObj;
    });

    var actualMulti = jsmin({'input': srcFiles, 'dest': dest}),
        expectedMultiCode = fs.readFileSync(expectedDir + '/' + dest, 'utf8');

    // Save to the code namespace
    info.code = {
      'input': srcFiles,
      'actual': actualMulti.code,
      'actualMap': actualMulti.sourcemap,
      'expected': expectedMultiCode
    };

    // Return info
    return info;
  },
  "matches its C-minified counterpart": function (info) {
    var code = info.code,
        paths = info.paths,
        srcPaths = JSON.stringify(paths.src);
    assert.strictEqual(code.actual, code.expected, 'Minified ' + srcPaths + ' does not match ' + paths.dest);
  // },
  // "mapped against its source": function (info) {
  //   // Localize code items
  //   var code = info.code,
  //       input = code.input,
  //       actual = code.actual,
  //       actualMap = code.actualMap;

  //   // Iterate over the input
  //   console.log

  //   // Generate a consumer and charProps lookups
  //   info.props = {
  //     'consumer': new SourceMapConsumer(actualMap),
  //     'actualProps': charProps(actual),
  //     'srcProps': charProps(src)
  //   };

  //   // Return the info
  //   return info;
  // },
  // "matches at all positions": function (info) {
  //   // Localize test items
  //   var srcCode = info.code.src,
  //       actualCode = info.code.actual,
  //       props = info.props,
  //       consumer = props.consumer,
  //       actualProps = props.actualProps,
  //       srcProps = props.srcProps;

  //   // Iterate over each of the characters
  //   var i = 0,
  //       len = actualCode.length,
  //       actualChar,
  //       actualPosition,
  //       srcPosition,
  //       srcLine,
  //       srcCol,
  //       srcChar;
  //   for (; i < len; i++) {
  //     actualChar = actualCode.charAt(i);
  //     actualPosition = {
  //       'line': actualProps.lineAt(i) + 1,
  //       'column': actualProps.columnAt(i)
  //     };
  //     srcPosition = consumer.originalPositionFor(actualPosition);
  //     srcLine = srcPosition.line - 1;
  //     srcCol = srcPosition.column;
  //     srcChar = srcProps.charAt({
  //       'line': srcLine,
  //       'column': srcCol
  //     });
  //     var expectedIndex = srcProps.indexAt({
  //       'line': srcLine,
  //       'column': srcCol
  //     });

  //     // Assert that the actual and expected characters are equal
  //     assert.strictEqual(actualChar, srcChar, 'The sourcemapped character at index ' + i + ' does not match its original character at line ' + srcLine + ', column ' + srcCol + '.');
  //   }
  }
};

//   "jQuery and Underscore": {
//   "Multiple files": {