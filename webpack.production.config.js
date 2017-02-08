var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public', 'build');
var mainPath = path.resolve(__dirname, 'src', 'entry.js');

var config = {
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
     historyApiFallback: true,
     headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
 },
  plugins: [ new Webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }), new Webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production'),
          'API_URL': JSON.stringify('https://beverlywalker.herokuapp.com')
        }
      })]
};

module.exports = config;
