/* jshint node: true */
'use strict';

var fs = require('fs');
var Plugin = require('broccoli-plugin');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');

var customTestFilePath = 'my-custom-test-files/foo.js';

AddCustomTestFile.prototype = Object.create(Plugin.prototype);
AddCustomTestFile.prototype.constructor = AddCustomTestFile;
function AddCustomTestFile(inputNodes) {
  Plugin.call(this, inputNodes);
}

AddCustomTestFile.prototype.build = function() {
  var outPath = path.join(this.outputPath, customTestFilePath);
  fs.mkdirSync(path.dirname(outPath));
  fs.writeFileSync(outPath, 'window.testing123 = true;');
};

module.exports = {
  name: 'test-hook-bug',
  included: function(app) {
    app.import(customTestFilePath);
  },
  postprocessTree: function(type, tree){
    if (type === 'test' || type ==='js') {
      return mergeTrees([tree, new AddCustomTestFile([tree])]);
    }
    return tree;
  }
};
