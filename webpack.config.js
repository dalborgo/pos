const webpack = require('webpack');
const path = require("path");
module.exports = {
    entry: {
        app: './src/App.jsx',
        vendor: ['react', 'react-dom', 'whatwg-fetch', 'babel-polyfill', 'react-router-dom', 'react-bootstrap', 'react-router-bootstrap'],
    },
    output: {
        path: path.resolve('static'),
        filename: 'app.bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js'})
    ],
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ["transform-object-rest-spread"]
                }
            },
        ]
    },
    devServer: {
        port: 8000,
        contentBase: 'static',
        proxy: {
            '/api/*': {
                target: 'http://localhost:3000'
            }
        },
    historyApiFallback: true,
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    devtool: 'source-map'
};