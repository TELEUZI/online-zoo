const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

module.exports = {
  entry: './src/app.ts',
  module: {
    rules: [
      {
        test: [/\.tsx?$/],
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /.(?:ico|gif|png|jpg|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new HtmlWebpackInlineSVGPlugin({
      inlineAll: true,
    }),
  ],

  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    compress: true,
    port: 4001,
  },
};
