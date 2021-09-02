require('babel-polyfill')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = merge(common, {
  mode: 'development',
  entry: ['babel-polyfill', path.join(__dirname, 'src/index.js')],
  target: 'web',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|jpe?g|png|gif)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 5000,
    hot: true
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerPort: 5001,
      openAnalyzer: false,
      analyzerHost: 'localhost',
    }),
  ],
  // ? webpack < 5 used to include polyfills for node.js core modules by default. Adding for Crypto-JS module
  resolve: {
    fallback: {
      "crypto": false,
      "crypto-browserify": require.resolve('crypto-browserify'), // ? if you want to use this module also don't forget npm i crypto-browserify
    } 
  }
})
