var fs = require('fs'),
    assert = require('assert'),
    jsmin = require('../lib/jsmin.sourcemap.js'),
    testFilesDir = __dirname + '/test_files',
    expectedDir = __dirname + '/expected_files',
    jQuerySrc = fs.readFileSync(testFilesDir + '/jquery.js', 'utf8'),
    expectedJQuery = fs.readFileSync(expectedDir + '/jquery.min.js', 'utf8'),
    actualJQuery = jsmin({'code':jQuerySrc,'src':'jquery.js','dest':'jquery.min.js'}),
    actualJQueryCode = actualJQuery.code;

// Assert that the minified jQuery matches the expected version
assert.strictEqual(expectedJQuery, actualJQueryCode, 'Minified jQuery does not match as expected.');

// TODO: Add reversal test for sourcemap -- do all the characters line up?

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