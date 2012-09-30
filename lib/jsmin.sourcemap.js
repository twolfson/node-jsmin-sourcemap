var jsmin = require('jsmin2'),
    sourcemap = require('source-map'),
    sourcemapGenerator = sourcemap.SourceMapGenerator,
    sourceNode = sourcemap.sourceNode;

// TODO: Put this in as a pull request for source-map
function lineAt(input, index) {
  // TODO: No linear search please x_x
  // Break up lines by line breaks
  var lines = input.split('\n');

  // Iterate over the lines until we reach the end or we hit our index
  var i = 0,
      len = lines.length,
      line,
      lineStart = 0,
      lineEnd;
  for (; i < len; i++) {
    // Grab the line
    line = lines[i];

    // Calculate the line end (includes \n we removed)
    lineEnd = lineStart + line.length + 1;

    // If the index is under the line end, stop
    if (index <= lineEnd) {
      break;
    }

    // Overwrite lineStart with lineEnd
    lineStart = lineEnd;
  }

  // Return the number of the line we stopped on
  return i;
}

function columnAt(input, index) {
  // Start at the index
  var col = 0,
      char,
      i = index;

  // If the index is negative, return now
  if (index < 0) {
    return 0;
  }

  // Continue left until index <= 0 or we hit a line break
  for (; i >= 0; i--, col += 1) {
    char = input.charAt(i);
    if (char === '\n') {
      break;
    }
  }

  // Return the col of our index
  return col;
}

/**
 * JSMin + source-map
 * @param {String} input JavaScript to minifiy
 * @return {Object} retObj
 * @return {String} retObj.code Minified JavaScript
 * @return {Object} retObj.sourcemap Sourcemap of input to minified JavaScript
 */
module.exports = function (input) {
  var codeObj = jsmin(input),
      codeMap = codeObj.codeMap,
      srcMapGenerator = new sourcemapGenerator({'file': 'abcd'});

  // Grab the keys of the codeMap
  var srcPoints = Object.getOwnPropertyNames(codeMap);
  srcPoints.forEach(function (srcPoint) {
    // Get the line and col
    var line = lineAt(input, srcPoint),
        col = columnAt(input, srcPoint);

console.log(line, col);
  });

  return codeObj;
};