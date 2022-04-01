const { merge } = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'development',
  output: {
    publicPath: '/',
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    noParse: /lodash/,
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.(t|j)s$/,
        exclude: '/node_modules/',
        include: path.resolve(__dirname, '../src'),
        use: [
          {
            loader: 'thread-loader', // 开启多进程打包  弃用happy-pack
            options: {
              worker: 3,
            },
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(t|j|mj)s$/,
        include: path.resolve(__dirname, '../node_modules/element-plus'),
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(sa|sc|le)ss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 与 url-loader 配置不同
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: 'font/[name][ext]',
        },
      },
      {
        test: /\.(mp4|ogg|mp3|wav)$/,
        type: 'asset',
        generator: {
          filename: 'media/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
    }),
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ],
  target: 'web',
  devServer: {
    port: 3001,
    hot: true, // 启用热模块替换
    open: true, // 打开默认浏览器
  },
})
