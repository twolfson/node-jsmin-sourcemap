// Load in dependencies
var assert = require('assert'),
    fs = require('fs'),
    sourcemap = require('source-map'),
    charProps = require('char-props'),
    jsmin = require('../'),
    SourceMapConsumer = sourcemap.SourceMapConsumer,
    testFilesDir = __dirname + '/test_files';

function minifySingle() {
  before(function () {
    // Read in the src file
    var params = this.params,
        src = params.src,
        singleSrc = fs.readFileSync(testFilesDir + '/' + src, 'utf8');

    // Save to the code namespace
    this.input = [{'src': src, 'code': singleSrc}];
    this.result = jsmin({'code': singleSrc, 'src': src, 'dest': params.dest});
  });
}

function minifyMulti() {
  before(function () {
    // Localize the src
    var params = this.params,
        src = params.src;

    // Read in the src files
    var srcFiles = src.map(function (filepath) {
      var fileSrc = fs.readFileSync(testFilesDir + '/' + filepath, 'utf8'),
          retObj = {
            'code': fileSrc,
            'src': filepath
          };
      return retObj;
    });

    // Save relevant info
    this.input = srcFiles;
    this.result = jsmin({'input': srcFiles, 'dest': params.dest});
  });
}

function assertMatchesC() {
  it('matches its C-minified counterpart', function () {
    var params = this.params,
        expectedCode = fs.readFileSync(__dirname + '/expected_files/' + params.dest, 'utf8');
    assert.strictEqual(
      this.result.code,
      expectedCode,
      'Minified ' + JSON.stringify(params.src) + ' does not match ' + params.dest
    );
  });
}

function mapAgainstSource() {
  before(function () {
    // Iterate over the input
    var srcPropMap = {};
    this.input.forEach(function (item) {
      srcPropMap[item.src] = charProps(item.code);
    });

    // Generate a consumer and charProps lookups
    var result = this.result;
    this.srcConsumer = new SourceMapConsumer(result.sourcemap);
    this.actualProps = charProps(result.code);
    this.srcPropMap = srcPropMap;
  });
}

function assertAllPositionsMatch() {
  it('matches at all positions', function () {
    // Iterate over each of the characters
    var breaks = this.expectedBreaks || [],
        result = this.result,
        actualCode = result.code,
        actualProps = this.actualProps,
        i = 0,
        len = actualCode.length;
    for (; i < len; i++) {
      // Look up the position of our index
      var actualPosition = {
        'line': actualProps.lineAt(i) + 1,
        'column': actualProps.columnAt(i)
      };

      // Grab the position of the item and its fil
      var srcPosition = this.srcConsumer.originalPositionFor(actualPosition),
          srcFile = srcPosition.source;

      // If we have a source file and we are not at a break spot
      // TODO: Actually figure out `breaks`
      var atBreakSpot = breaks.indexOf(i) > -1;
      if (srcFile && !atBreakSpot) {
        // Grab the srcProps for it
        var srcProps = this.srcPropMap[srcFile];

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
  });
}

function isDebuggable() {
  if (process.env.TEST_DEBUG) {
    before(function () {
      var actualCode = this.result.code;
      try { fs.mkdirSync(__dirname + '/actual_files'); } catch (e) {}
      fs.writeFileSync(__dirname + '/actual_files/debug.min.js', actualCode, 'utf8');
    });
  }
}

describe('jQuery', function () {
  before(function jQueryPaths () {
    this.params = {'src': 'jquery.js', 'dest': 'jquery.min.js'};
  });

  describe('minified and sourcemapped (single)', function () {
    minifySingle();
    isDebuggable();

    assertMatchesC();

    describe('mapped against its source', function () {
      mapAgainstSource();

      assertAllPositionsMatch();
    });
  });
});

describe('Multiple files', function () {
  before(function multiPaths () {
    this.params = {'src': ['1.js', '2.js', '3.js'], 'dest': 'multi.js'};
    this.expectedBreaks = [52, 70];
  });

  describe('minified and sourcemapped (multi)', function () {
    minifyMulti();
    isDebuggable();

    assertMatchesC();

    describe('mapped against its source', function () {
      mapAgainstSource();

      assertAllPositionsMatch();
    });
  });
});

describe('Multiple nested files', function () {
  before(function () {
    this.params = {
      'src': [
        'nested.js',
        'nested/controllers/controller1.js',
        'nested/controllers/controller2.js',
        'nested/models/model1.js'
      ],
      'dest': 'nested.min.js'
    };
    this.expectedBreaks = [1, 43, 88, 100];
  });

  describe('minified and sourcemapped (multi)', function () {
    minifyMulti();
    isDebuggable();

    assertMatchesC();

    describe('mapped against its source', function () {
      mapAgainstSource();

      assertAllPositionsMatch();
    });
  });
});
