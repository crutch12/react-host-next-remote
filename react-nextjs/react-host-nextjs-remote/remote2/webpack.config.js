const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack')
const { NativeFederationTypeScriptHost } = require('@module-federation/native-federation-typescript/webpack')
const deps = require('./package.json').dependencies;

const federationConfig = {
  name: 'host',
  filename: 'remoteEntry.js',
  remotes: {
    // remote: 'remote@http://localhost:8081/_next/static/chunks/remoteEntry.js',
    remote: 'remote@http://localhost:8080/remoteEntry.js',
  },
  exposes: {
    './App': './src/App.tsx',
  },
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
  },
}

module.exports = () => {
  return {
    entry: './src/index.tsx',
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
      extensions: ['.jsx', '.js', '.json', '.mjs', '.ts', '.tsx'],
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
        // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
        {
          test: /\.([cm]?ts|tsx)$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        ...federationConfig
      }),
      NativeFederationTypeScriptHost({
        moduleFederationConfig: federationConfig,
      }),
      // NativeFederationTypeScriptRemote({
      //   moduleFederationConfig: federationConfig,
      // }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],

    devServer: {
      static: false, // disable default serving ./public dir
      historyApiFallback: {
        index: '/',
      },
      port: 8081,
    },
  };
}
