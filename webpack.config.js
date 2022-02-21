const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer();

dotenv.config()

module.exports = {
  mode: 'none',
  entry: {
    app: path.join(__dirname, 'src', 'index.tsx')
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({before: [styledComponentsTransformer]})
        }
      }
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html')
    })
  ],
  devServer: {
    allowedHosts: 'all',
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8888,
  },
  devtool: "source-map"
}