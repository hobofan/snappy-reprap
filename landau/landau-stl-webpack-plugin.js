var Landau = require('@landaujs/landau');
var stlSerializer = require('@jscad/stl-serializer');
var makeBlob = require('@jscad/io-utils').makeBlob;

function LandauStlWebpackPlugin(options) {
  // Setup the plugin instance with options...
}

LandauStlWebpackPlugin.prototype.apply = function(compiler) {
  compiler.plugin('after-compile', function(compilation, callback) {
    Object.keys(compilation.assets).forEach(function(filename) {
      var source = compilation.assets[filename].source();
      // TODO: fail if not an Landau element
      var element = eval(source);
      var csg = Landau.renderAsCsg(element);

      var result = stlSerializer.serialize(csg, {binary: true});
      const blob = new makeBlob()(result);
      const buffer = blob.buffer;

      var newSource = {
        source: function() {
          return buffer;
        },
        size: function() {
          return blob.size;
        },
      };

      compilation.assets[filename] = newSource;
    });

    callback();
  });
};

module.exports = LandauStlWebpackPlugin;
