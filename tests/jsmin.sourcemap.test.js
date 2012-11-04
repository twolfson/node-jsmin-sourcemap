var vows = require('vows'),
    commands = require('./jsmin.sourcemap.commands.js');

var suite = vows.describe('jsmin-sourcemap');

suite.addBatch({
  'test': {
    'test2': function () {
      return 2;
    }
  }
});

// Export the batch as a suite
suite['export'](module);

// module.exports = [{
//   "jQuery": {
//     "minified and sourcemapped": {
//       "matches its C-minified counterpart": true
//       // // "is debuggable": true,
//       // "mapped against its source": {
//       //   "matches at all positions": true
//       // }
//     }
//   }
// // }, {
// //   "jQuery and Underscore": {
// //     "minified and sourcemapped": {
// //       "matches its C-minified counterpart": true,
// //       // "is debuggable": true,
// //       "mapped against its source": {
// //         "matches at all positions": true
// //       }
// //     }
// //   }
// // }, {
// //   "Multiple files": {
// //     "minified and sourcemapped": {
// //       "matches its C-minified counterpart": true,
// //       // "is debuggable": true,
// //       "mapped against its source": {
// //         "matches at all positions": true
// //       }
// //     }
// //   }
// }];
// // TODO: Multi-nested