const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced')
const deps = require('./package.json').dependencies;
module.exports = {
  entry: {
    app: {
      import: './src/index',
    },
  },
  cache: false,

  mode: 'development',
  devtool: 'source-map',

  optimization: {
    minimize: false,
  },

  output: {
    publicPath: 'auto',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.mjs'],
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        options: {
          presets: [require.resolve('@babel/preset-react')],
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      // remotes: {
      //   remote: 'remote@http://localhost:8081/_next/static/chunks/remoteEntry.js',
      // },
      exposes: {},
      shared: {
        react: {
          // Notice shared are NOT eager here.
          requiredVersion: false,
          singleton: true,
        },
        'react-dom': {
          // Notice shared are NOT eager here.
          requiredVersion: false,
          singleton: true,
        },
        'next/head': {
          requiredVersion: false,
          singleton: true,
        },
        'next/image': {
          requiredVersion: false,
          singleton: true,
        },
        'next/link': {
          requiredVersion: false,
          singleton: true,
        }
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
