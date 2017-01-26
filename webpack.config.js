var path = require('path');

module.exports = {
  entry: [
    './src/index.js',
  ],
  output: {
    path: __dirname,
    filename: 'dist/index.js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['', '.js'],
  },
  module: {
    preLoaders: [
      {
        loader: 'eslint',
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
      },
    ],
    loaders: [
      {
        loader: 'babel',
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
};