const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const isProduction = process.env.NODE_ENV == 'production';

module.exports = {
  entry: './src/app.ts',
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: {
          chunks: 'all',
          enforce: true,
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: [/\.ts?$/],
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        exclude: [/node_modules/],
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        oneOf: [
          {
            test: /_inline.svg$/,
            type: 'asset/source',
          },
          {
            test: /.(?:ico|gif|png|jpg|svg)$/,
            type: 'asset/resource',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Async race',
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: false,
      },
    }),
    new MiniCssExtractPlugin(),
    ...(!isProduction ? [new ForkTsCheckerWebpackPlugin()] : []),
  ],
  mode: isProduction ? 'production' : 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[id].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: isProduction ? 'inline-source-map' : false,
  devServer: {
    historyApiFallback: true,
    compress: true,
    port: 4001,
  },
};
