const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CustomizedCleanWebpackPlugin } = require('./misc/custom-plugins/customCleanWebpackPlugin');
const webpack = require('webpack');
const config = require('./src/config/config');

module.exports = [
  {
    name: 'testapp-build',
    mode: 'development',
    entry: './misc/test-app/index.js',
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
        template: './misc/test-app/index.html'
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: ['process']
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
            {
              loader: "sass-loader",
              options: {
                additionalData: "$keyless_ui_class: " + config.KEYLESS_UI_CLASSNAME + ";",
              },
            }
            
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/inline',
        }
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
    mode: 'production',
    entry: './src/index.js',
    output: {
      filename: 'keyless.umd.min.js',
      path: path.resolve(__dirname, 'lib'),
      clean: true,
      library: {
        name: "SafleKeyless",
        type: "umd"
      }
    },
    
    devtool: 'inline-source-map',
    plugins: [
      new CustomizedCleanWebpackPlugin(),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: ['process']
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
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
            {
              loader: "sass-loader",
              options: {
                additionalData: "$keyless_ui_class: " + config.KEYLESS_UI_CLASSNAME + ";",
              },
            }
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
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