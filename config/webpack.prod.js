const { merge } = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'production',
  output: {
    publicPath: 'https://xxx.xxx.com/sea/study-vue3',
    //  [hash] is now [fullhash] (also consider using [chunkhash] or [contenthash], see documentation for details)
    filename: 'js/[name]-[fullhash].js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  cache: {
    // 1. 将缓存类型设置为文件系统
    type: 'filesystem',
    buildDependencies: {
      // 2. 将 config 添加为 buildDependency，以便在改变 config 时获得缓存无效
      config: [__filename],
    },
  },
  optimization: {
    minimize: true, // 使用TerserPlugin 压缩
    minimizer: [new CssMinimizerPlugin()],
    splitChunks: {
      // 选择对哪些文件进行拆分，默认是async，即只对动态导入的文件进行拆分
      chunks: 'all',
      // 提取chunk的最小体积
      minSize: 20000,
      // 要提取的chunk最少被引用次数
      minChunks: 1,
      // 对要提取的chunk进行分组
      cacheGroups: {
        // 匹配node_modules中的三方库，将其打包成一个chunk
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
        },
        default: {
          // 将至少被两个chunk引入的模块提取出来打包成单独chunk
          minChunks: 2,
          name: 'default',
          priority: -20,
        },
      },
    },
  },
  devtool: 'eval-cheap-module-source-map',
  externals: {
    lodash: '_',
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 与 url-loader 配置不同
          filename: 'images/[name]-[fullhash][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 超过10kb不转 base64
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: 'font/[name][fullhash][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 超过10kb不转 base64
          },
        },
      },
      {
        test: /\.(mp4|ogg|mp3|wav)$/,
        type: 'asset',
        generator: {
          filename: 'media/[name][fullhash][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[id]-[contenthash].css',
    }),
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ],
})
