var vows = require('vows'),
    traverse = require('traverse'),
    commands = require('./jsmin.sourcemap.commands.js');

// TODO: Move from function to OOP
function addCommands(batch) {
  // Traverse over the batch
  traverse(batch).forEach(function traverseBatch (node) {
    var key = this.key;

    // If there is a key
    if (key) {
      // Look up the command for it
      var command = commands[key];

      // If there is a command
      if (command) {
        // If the node is an object
        if (typeof node === 'object') {
          // Add it as a topic
          var topic = node.topic || command;

          // DEV: Wrap the topic inside of a try/catch for debugging
          node.topic = function () {
            var retVal;
            try {
              retVal = topic.apply(this, arguments);
            } catch (e) {
              console.error(e);
            }
            return retVal;
          };
        } else {
          // Otherwise, save it over the node itself
          node = command;
        }
      }
    }

    // Return the node
    return node;
  });

  // Return the batch
  return batch;
}

// Set up the vows suite
var suite = vows.describe('jsmin-sourcemap');

// var batch = addCommands({
//   "jQuery": {
//     "minified and sourcemapped (single)": {
//       "matches its C-minified counterpart": true,
//       // "is debuggable": true,
//       "mapped against its source": {
//         "matches at all positions": true
//       }
//     }
//   }
// });
// suite.addBatch(batch);

// var batch = addCommands({
//   "jQuery and Underscore": {
//     "minified and sourcemapped": {
//       "matches its C-minified counterpart": true,
//       // "is debuggable": true,
//       "mapped against its source": {
//         "matches at all positions": true
//       }
//     }
//   }
// });
// suite.addBatch(batch);

var batch = addCommands({
  "Multiple files": {
    "minified and sourcemapped (multi)": {
      "matches its C-minified counterpart": true,
      // "is debuggable": true,
      "mapped against its source": {
        "matches at all positions": true
      }
    }
  }
});
suite.addBatch(batch);
// // TODO: Multi-nested

// Export the batch as a suite
suite['export'](module);