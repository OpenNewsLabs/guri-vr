
var webpack = require('webpack');
var OfflinePlugin = require('offline-plugin');
var devConfig = require('./webpack.config.dev');

module.exports = Object.assign({}, devConfig, {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false          
      }
    }),
    new OfflinePlugin({
      externals: ['styles.css', 'translations/en.json', 'translations/es.json'],
      caches: {
        main: ['app.js', 'styles.css', 'translations/en.json', 'translations/es.json']
      },
      ServiceWorker: {
        navigateFallbackURL: '/'
      }
    })
  ]
});
