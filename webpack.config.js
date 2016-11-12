/**
 * webpack.config.js
 */
var webpack = require('webpack');

process.argv.shift();
process.argv.shift();

var args = process.argv;
var env = args[0];

var config = {
  '--dev': {
    output: {
      filename: 'target.js'
    },
    plugins: []
  },

  '--prod': {
    output: {
      filename: 'target.min.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        comments: false
      })
    ]
  }
};

module.exports = {
  context: __dirname,
  entry: './src/main.js',
  output: {
    path: __dirname + '/dist',
    filename: config[env].output.filename
  },
  plugins: [
    // add browser polyfills
    // we can do this by resolving module names at runtime
    // for example, if "WeakMap" exists in the browser, use it
    // else use included polyfill
    new webpack.ProvidePlugin({
      WeakMap: 'imports?this=>global!exports?global.WeakMap!weak-map',
      MutationObserver: 'imports?this=>global!exports?global.MutationObserver!mutation-observer'
    })
  ].concat(config[env].plugins),
  module: {
    loaders: [{
      test: /\.js$/,
      include: /src/,
      exclude: __dirname + '/node_modules',
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  }
};
