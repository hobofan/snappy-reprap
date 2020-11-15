const path = require('path');
const glob = require("glob");
const LandauSTLPlugin = require('./landau-stl-webpack-plugin');

const buildEntries = () => {
  const paths = glob.sync('./parts/*.js');
  const basenames = paths.map((filepath) => path.basename(filepath, '.js'));

  const entries = {};
  basenames.forEach((basename, i) => {
    entries[basename] = paths[i];
  });
  return entries;
};

module.exports = {
  entry: buildEntries(),
  output: {
    path: path.resolve(__dirname, 'STLs'),
    filename: '[name].stl',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new LandauSTLPlugin(),
  ]
};
