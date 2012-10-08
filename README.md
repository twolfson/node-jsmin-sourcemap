# node-jsmin-sourcemap

JSMin with sourcemaps!

## Getting Started
Install the module with: `npm install jsmin-sourcemap`

## Documentation
JSMin is a standalone function which takes the following format of paramters
```js
/**
 * JSMin + source-map
 * @param {Object} params Parameters to minify and generate sourcemap with
 * @param {String} [params.dest="undefined.js"] Destination for your JavaScript (used inside of sourcemap map)
 *
 * SINGLE FILE FORMAT
 * @param {String} params.src  File path to original JavaScript (seen when an error is thrown)
 * @param {String} params.code JavaScript to minify
 *
 * MULTI FILE FORMAT
 * @param {Object[]} params.input Array of objects) to minify
 * @param {String} params.input[n].src File path to original JavaScript (seen when an error is thrown)
 * @param {String} params.input[n].code JavaScript to minify
 *
 * @return {Object} retObj
 * @return {String} retObj.code Minified JavaScript
 * @return {Object} retObj.sourcemap Sourcemap of input to minified JavaScript
 */
```

## Examples
### Single file
```js
// Load in jsmin and jQuery
var jsmin = require('node-jsmin-sourcemap'),
    jquerySrc = fs.readFileSync('jquery.js', 'utf8');

// Process the jquery source via jsmin
var jqueryMinObj = jsmin({'code':jQuerySrc,'src':'jquery.js','dest':'jquery.min.js'});

// Minified code is availabe at
// jqueryMinObj.code;

// Sourcemap is availabe at
// jqueryMinObj.sourcemap;
```

### Multiple files
```js
// Load in jsmin, jQuery, and underscore
var jsmin = require('node-jsmin-sourcemap'),
    jquerySrc = fs.readFileSync('jquery.js', 'utf8'),
    underscoreSrc = fs.readFileSync('underscore.js', 'utf8');

// Process the jquery amd underscore source via jsmin
var indexMinObj = jsmin({
      'input': [{
        'code': jQuerySrc,
        'src': 'jquery.js'
      }, {
        'code': underscoreSrc,
        'src': 'underscore.js'
      }],
      'dest':'index.min.js'
    });

// Minified code is availabe at
// indexMinObj.code;

// Sourcemap is availabe at
// indexMinObj.sourcemap;
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint your code via [grunt](http://gruntjs.com/) and test via `npm test`.

## License
Copyright (c) 2012 Todd Wolfson
Licensed under the MIT license.