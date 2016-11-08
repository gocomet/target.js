/**
 * webpack.config.js
 */
module.exports = {
  context: __dirname,
  entry: './src/js/main.js',
  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: /src\/js/,
      exclude: __dirname + '/node_modules',
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  }
};
