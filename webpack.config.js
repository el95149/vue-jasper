const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { VueLoaderPlugin } = require("vue-loader")

var config = {
    output: {
        path: path.resolve(__dirname + '/dist/')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: __dirname,
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                loader: 'style!less!css'
            }
        ]
    },
    externals: {
        axios: 'axios',
        'element-ui': 'element-ui',
        'font-awesome': 'font-awesome'
    },
    plugins: [new VueLoaderPlugin()],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    sourceMap: false,
                    mangle: true,
                    compress: {
                        warnings: false
                    }
                }
            })
        ]
    }
}
module.exports = [
    merge(config, {
        entry: path.resolve(__dirname + '/src/index.js'),
        output: {
            filename: 'vue-jasper.min.js',
            libraryTarget: 'window',
            library: 'VueJasper'
        }
    }),
    merge(config, {
        entry: path.resolve(__dirname + '/src/VueJasper.vue'),
        output: {
            filename: 'vue-jasper.js',
            libraryTarget: 'umd',
            library: 'vue-jasper',
            umdNamedDefine: true
        }
    })
]
