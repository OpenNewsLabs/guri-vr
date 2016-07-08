
var path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, '..', 'public'),
    filename: 'app.js'
  },
  module: {
    loaders: [
      { loader: 'babel-loader', test: /\.js$/, exclude: /node_modules/ }
    ]
  },
  resolve: {
    root: [ path.resolve('./src') ],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  }
};
