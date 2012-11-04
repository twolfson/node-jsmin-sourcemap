var fs = require('fs'),
    assert = require('assert'),
    jsmin = require('../lib/jsmin.sourcemap.js'),
    testFilesDir = __dirname + '/test_files',
    expectedDir = __dirname + '/expected_files';

// Define all of the commands that a test will use
module.exports = {
  "jQuery": function jQueryPaths () {
    return {'paths': {'src': 'jquery.js', 'dest': 'jquery.min.js'}};
  },
  "minified and sourcemapped (single)": function (info) {
    // Localize the src and dest
    var filePaths = info.paths,
        src = filePaths.src,
        dest = filePaths.dest;

    // Read in the src file
    var singleSrc = fs.readFileSync(testFilesDir + '/' + src, 'utf8'),
        actualSingle = jsmin({'code':singleSrc, 'src': src, 'dest': dest}),
        expectedSingleCode = fs.readFileSync(testFilesDir + '/' + src, 'utf8');

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

    // Return actualSingle
    return info;
  },
  "matches its C-minified counterpart": function (info) {
    var code = info.code,
        paths = info.paths,
        srcPaths = JSON.stringify(paths.src);
    assert.strictEqual(code.actual, code.expected, 'Minified ' + srcPaths + ' does not match ' + paths.dest);
  }
};

//   "jQuery": {
//     "minified and sourcemapped": {
//       "matches its C-minified counterpart": true,
//       // "is debuggable": true,
//       "mapped against its source": {
//         "matches at all positions": true
//       }
//     }
//   }
// }, {
//   "jQuery and Underscore": {
//   "Multiple files": {