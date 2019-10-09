var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path')
var config = require('./config.json')

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { use: 'babel-loader', test: /\.js$/, include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'shared')] },
      { use: 'json-loader', test: /\.json$/, exclude: /node_modules/ }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      'node_modules'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.ejs'),
      templateParameters: config
    })
  ]
}
