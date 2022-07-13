require('dotenv').config()
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const HtmlPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isDev = process.env.NODE_ENV === 'dev'
const isLocal = process.env.ENV_LOCAL
// triggle depoly 0713
module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    index: '/src/index.js'
  },
  output: {
    filename: isDev ? '[name].bundle.js' : '[name].[hash:6].js',
    chunkFilename: isDev ? '[name].bundle.js' : '[name].[chunkhash:4].js',
    path: path.resolve('./dist'),
    publicPath: '/'
  },
  node: { fs: 'empty' },
  module: {
    rules: [
      {
        test: /\.js$/,
        // enforce: 'post',
        include: path.resolve('./src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-async-to-generator'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader'
        ]
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          isDev ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: !isDev
                ? '[folder]_[hash:base64:10]'
                : '[folder]_[local]_[hash:base64:5]',
              },
              localsConvention: 'dashes'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()],
            }
          },
          'sass-loader',
        ]
      },
      {
        test: /\.(jpg|png|gif)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: isDev
              ? 'image/[name].[ext]'
              : 'image/[name].[hash:7].[ext]'
            }
          }
        ]
      },
    ]
  },
  plugins: [
    !isDev && new CleanPlugin(),
    !isDev && new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    }),
    !isDev && new HtmlPlugin({
      title: 'torrent to magnet',
      meta: {
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      },
      templateContent: `<div class="root"><input type="text" class="filepond-root" type="file"></div>`,
      inject: 'body',
      minify: true
    }),
    isDev && new webpack.HotModuleReplacementPlugin(),
    isDev && new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    (!isDev && isLocal) && new BundleAnalyzerPlugin()
  ].filter(Boolean),
  devServer: {
    // contentBase: '',
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 8000,
    hot: true,
    historyApiFallback: true,
  },
  devtool: 'source-map'
}
