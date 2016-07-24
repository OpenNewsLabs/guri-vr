
var path = require('path');
var OfflinePlugin = require('offline-plugin');

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, '..', 'public'),
    filename: 'app.js'
  },
  module: {
    loaders: [
      { loader: 'babel-loader', test: /\.js$/, exclude: /node_modules/ },
      { loader: 'json-loader', test: /\.json$/, exclude: /node_modules/ }
    ]
  },
  resolve: {
    root: [ path.resolve('./src') ],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },
  plugins: [
    new OfflinePlugin({
      externals: ['/', 'styles.css'],
      ServiceWorker: {
        navigateFallbackURL: '/'
      }
    })
  ]
};
