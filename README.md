# node-jsmin-sourcemap [![Build status](https://travis-ci.org/Ensighten/grunt-spritesmith.png?branch=master)](https://travis-ci.org/Ensighten/grunt-spritesmith)

JSMin with sourcemaps!

Also available as a [grunt plugin](https://github.com/twolfson/grunt-jsmin-sourcemap)!

## Synopsis
[JSMin](http://www.crockford.com/javascript/jsmin.html) is a JavaScript minifier that removes whitespace and comments.

[Source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) enables developers to view and interact with minified JavaScript as if it were unminified (providing useful line errors and easier debugging).

When you combine both of these, you get a node module that is your new best debugging friend.

## Getting Started
Install the module with: `npm install jsmin-sourcemap`

## Demos
The folders in `demo` are hosted on Plunker for your testing and enjoyment.

- Basic [http://embed.plnkr.co/mGHUpe](http://embed.plnkr.co/mGHUpe)
- jQuery [http://embed.plnkr.co/JyNn5e](http://embed.plnkr.co/JyNn5e)
- Multi [http://embed.plnkr.co/FPkQx6](http://embed.plnkr.co/FPkQx6)

## Documentation
JSMin is a standalone function which takes the following format of paramters
```js
/**
 * JSMin + source-map
 * @param {Object} params Parameters to minify and generate sourcemap with
 * @param {String} [params.dest="undefined.js"] Destination for your JavaScript (used inside of sourcemap map)
 * @param {String} [params.srcRoot] Optional root for all relative URLs
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

// Minified code is available at
// jqueryMinObj.code;

// Sourcemap is available at
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
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Unlicense
As of Dec 04 2013, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE

Previous to this, it was licensed under the [MIT license][].

[MIT license]: https://github.com/twolfson/node-jsmin-sourcemap/blob/3c92dddc788658351b87c608c5da770272f178c0/README.md#license