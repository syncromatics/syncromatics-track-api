var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
webpackConfig.entry = {};

module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha'],
    files: [
      './node_modules/babel-polyfill/dist/polyfill.js',
      './node_modules/whatwg-fetch/fetch.js',
      './src/tests.js'
    ],
    preprocessors: {
      './src/tests.js': ['sourcemap', 'webpack']
    },
    reporters: ['mocha'],
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    },
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    }
  });
};
