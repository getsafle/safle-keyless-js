const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

require('dotenv').config();

module.exports = [
  {
    name: 'webbuild',
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
      hot: true,
      compress: true,
      port: 9000,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Development',
        template: './src/index.html'
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env)
     })
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/inline',
        },
      ],
    },
    resolve: {
      alias: {
        url: require.resolve( "url" ),
        process: require.resolve('process'),
        buffer: require.resolve("buffer"),
        assert: require.resolve( "assert" ),
        http: require.resolve( "stream-http" ),
        https: require.resolve( "https-browserify" ),
        os: require.resolve( "os-browserify/browser" ),
        path: require.resolve( "path-browserify" ),
        stream: require.resolve( "stream-browserify" ),
        crypto: require.resolve( "crypto-browserify" ),
      }
    }
  },

  {
    name: 'library',
    mode: 'development',
    entry: './src/keyless/index.js',
    output: {
      filename: 'keyless.js',
      path: path.resolve(__dirname, 'library'),
      clean: true,
    },
    devtool: 'inline-source-map',
    devServer: {
      static: './library',
      hot: true,
      compress: true,
      port: 9000,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Development'
      }),
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/inline',
        },
      ],
    },
    resolve: {
      alias: {
        url: require.resolve( "url" ),
        process: require.resolve('process'),
        buffer: require.resolve("buffer"),
        assert: require.resolve( "assert" ),
        http: require.resolve( "stream-http" ),
        https: require.resolve( "https-browserify" ),
        os: require.resolve( "os-browserify/browser" ),
        path: require.resolve( "path-browserify" ),
        stream: require.resolve( "stream-browserify" ),
        crypto: require.resolve( "crypto-browserify" ),
      }
    }
  },
  
];