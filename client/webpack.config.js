
var webpack = require('webpack')
var path = require('path')
var OfflinePlugin = require('offline-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var devConfig = require('./webpack.config.dev')
var config = require('./config.json')

module.exports = Object.assign({}, devConfig, {
  plugins: [
    new HtmlWebpackPlugin({
      template:path.join(__dirname, 'src', 'index.ejs'),
      templateParameters: config
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new OfflinePlugin({
      externals: ['index.html', 'styles.css', 'translations/en.json', 'translations/es.json'],
      caches: {
        main: [
          'index.html', 'app.js', 'styles.css',
          'translations/en.json', 'translations/es.json',
          '0.app.js', '1.app.js', '2.app.js', '3.app.js', '4.app.js'
        ]
      },
      ServiceWorker: {
        navigateFallbackURL: '/'
      }
    })
  ]
})
