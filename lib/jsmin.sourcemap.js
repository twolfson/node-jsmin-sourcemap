var jsmin = require('jsmin2'),
    charProps = require('char-props'),
    sourcemap = require('source-map'),
    SourceMapGenerator = sourcemap.SourceMapGenerator;

/**
 * Minify a single code file
 * @param {Object} params
 * @param {String} params.code Code to minify
 * @param {String} params.src Filepath to original src
 * @param {String} params.dest Filepath to destination src
 * @return {Object} retObj
 * @return {String} retObj.code Minified JavaScript
 * @return {Object} retObj.sourcemap Sourcemap of input to minified JavaScript
 */
function minifySingle(params) {
  var input = params.code,
      codeObj = jsmin(input),
      code = codeObj.code,
      codeMap = codeObj.codeMap,
      srcFile = params.src,
      destFile = params.dest,
      srcMapGenerator = new SourceMapGenerator({'file': destFile});

  // Grab the keys of the codeMap
  var srcProps = charProps(input),
      destProps = charProps(code),
      lastSrcLine = 0,
      lastDestLine = 0,
      srcPoints = Object.getOwnPropertyNames(codeMap);
  srcPoints.forEach(function (srcPoint) {
    // TODO: Need to improve this ;_;
    // TODO: When we have time, track char + line + col inside of jsmin2
    // TODO: If columnAt starts to be the slow part, create a map which memoizes each of the indicies it `while` loops over -- an LRU is probably best here.
    // Get the line and col of the src
    var srcLine = srcProps.lineAt(srcPoint, {'minLine': lastSrcLine}),
        srcCol = srcProps.columnAt(srcPoint);

    // Save the srcLine as our next guess
    lastSrcLine = srcLine;

    // Get the line and col of the dest
    var destPoint = codeMap[srcPoint],
        destLine = destProps.lineAt(destPoint, {'minLine': lastDestLine}),
        destCol = destProps.columnAt(destPoint);

    // Save the destLine for our next guess
    lastDestLine = destLine;

    // Create our mapping
    var mapping = {
      'original': {
        'line': srcLine + 1,
        'column': srcLine
      },
      'generated': {
        'line': destLine + 1,
        'column': destCol
      },
      'source': srcFile
    };

    // Add the mapping to our generator
    srcMapGenerator.addMapping(mapping);
  });

  // Get our source map, save it, and return
  var srcMap = srcMapGenerator.toString(),
      retObj = {
        'code': code,
        'sourcemap': srcMap
      };
  return retObj;
}

/**
 * JSMin + source-map
 * @param {Object} params Parameters to minify and generate sourcemap with
 * @param {String} [params.dest="undefined.js"] Destination for your JavaScript (used inside of sourcemap map)
 * @param {Object|Object[]} params.input Object (or array of objects) to minify
 * @param {String} params.input.src File path to original JavaScript (seen when an error is thrown)
 * @param {String} params.input.code JavaScript to minify
 * @return {Object} retObj
 * @return {String} retObj.code Minified JavaScript
 * @return {Object} retObj.sourcemap Sourcemap of input to minified JavaScript
 */
// TODO: Multiple params.input not supported atm
// TODO: This itself could be a module (code + indexMap -> code + sourceMap)
module.exports = function (params) {
  var dest = params.dest || 'undefined.js',
      input = params.input;

  // Upcast input to an array
  if (!Array.isArray(input)) {
    input = [input];
  }

  // TODO: Support multiple files
  // Minify single file
  var firstInput = input[0],
      minParams = {
        'src': firstInput.src,
        'code': firstInput.code,
        'dest': dest
      },
      retObj = minifySingle(minParams);

  // Retun the retObj
  return retObj;
};