/**
 * webpack.config.js
 */
module.exports = {
  context: __dirname,
  entry: './src/main.js',
  output: {
    path: __dirname + '/dist',
    filename: 'target.js'
  },
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
