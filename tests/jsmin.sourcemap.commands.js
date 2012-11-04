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

    // Save to the proper namespaces


    // Return actualSingle
    return actualSingle;
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