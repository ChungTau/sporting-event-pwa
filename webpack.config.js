// NOTE: To use this example standalone (e.g. outside of repo) delete the local
// development overrides at the bottom of this file avoid destructuring for
// older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');
require('dotenv').config();

const config = {
    mode: 'development',

    devServer: {
        static: '.'
    },

    entry: {
        app: resolve('./src/app')
    },

    output: {
        library: 'App'
    },

    resolve: {
        extensions: [
            '.ts', '.tsx', '.js', '.json'
        ],
        alias: {
            webworkify: 'webworkify-webpack'
        },
        fallback: {
          "stream": require.resolve("stream-browserify"),
          "buffer": require.resolve("buffer")
      }
    },

    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                include: [resolve('.')],
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/env', '@babel/react']
                        }
                    }, {
                        loader: 'ts-loader'
                    }
                ]
            }, {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            }
        ]
    },

    // Optional: Enables reading mapbox token from environment variable
    plugins: [
        new webpack.EnvironmentPlugin(['REACT_APP_MAPBOX_ACCESS_TOKEN']),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
        new webpack.ProvidePlugin({process: 'process/browser'})
    ]
};

module.exports = env => env && env.local
    ? require('../webpack.config.local')(config)(env)
    : config;