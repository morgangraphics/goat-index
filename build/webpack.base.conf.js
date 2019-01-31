const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');

const resolve = function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const esLintLoader = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay,
  }
})

const DEV = process.env.NODE_ENV === 'development' || false;
const PROD = process.env.NODE_ENV === 'production' || false;
const TEST = process.env.NODE_ENV === 'test' || false;

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js',
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: PROD ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      ...(config.dev.useEslint? [esLintLoader()] : []),
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: vueLoaderConfig
        }]
      },{
        test: /\.js$/,
        use: [{
          loader: 'babel-loader'
        }],
        include: [resolve('src'), resolve('test')],
        exclude: /node_modules/,
      },{
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        }]
      },{
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        }]
      },{
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }]
      },{
        test: /\.(s)?css$/,
        use: [
            "style-loader", // creates style nodes from JS strings
            // "css-loader", // translates CSS into CommonJS
            //"sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
       },
    ]
  }
}
