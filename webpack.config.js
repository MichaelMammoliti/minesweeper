const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { DefinePlugin } = require('webpack');
const webpackTemplate = require('./webpack.template.js');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

require('dotenv').config({
  path: './.env.development',
  debug: true,
});

require('./webpack.utils.js');

module.exports = {
  entry: {
    app: './src/index.tsx',
  },
  mode: 'development',
  cache: true,
  target: 'web',
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|mp3)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  stats: 'errors-only',
  devServer: {
    static: './src',
    compress: true,
    port: 3000,
    hot: true,
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    pathinfo: false,
  },
  optimization: {
    usedExports: true,
  },
  plugins: [
    new DefinePlugin({
      FIREBASE_EMULATORS: process.env.FIREBASE_EMULATORS,
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      templateContent: webpackTemplate,
      hash: true,
    }),
    new CaseSensitivePathsPlugin(),
  ],
};
