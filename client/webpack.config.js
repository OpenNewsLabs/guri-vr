
var webpack = require('webpack')
var OfflinePlugin = require('offline-plugin')
var devConfig = require('./webpack.config.dev')

module.exports = Object.assign({}, devConfig, {
  plugins: [
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
