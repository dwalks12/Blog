var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public', 'build');
var mainPath = path.resolve(__dirname, 'src', 'entry.js');

var config = {

  // We change to normal source mapping
  //devtool: 'source-map',
  entry: mainPath,
  output: {
    path: buildPath,
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: [nodeModulesPath]
    },{
      test: /\.css$/,
      loader: 'style!css'
    },
    {
        test: /\.(jpg|png|gif|svg|otf)$/i,
        loader: 'file-loader?context=public&name=./public/[path][name].[ext]',
        query: {
          limit: 10000
        }
    }]
  },
  devServer: {
     historyApiFallback: true
 },
  plugins: [ new Webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })]
};

module.exports = config;
