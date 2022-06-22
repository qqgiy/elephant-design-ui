const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const HappyPack = require('happypack');
// i 不要同时使用 style-loader 与 mini-css-extract-plugin。
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        main: ['./src/dev.tsx'],
    },
    output: {
        filename: 'chunk.[name].[contenthash:8].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        pathinfo: false,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx'],
    },
    plugins: [
        new WebpackBar({
            color: '#007fff',
        }),
        new HappyPack({
            // 3) re-add the loaders you replaced above in #1:
            loaders: ['babel-loader'],
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        }),
    ].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
    module: {
        rules: [
            {
                test: /\.m?(ts|tsx)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: [
                    'happypack/loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-react',
                                [
                                    '@babel/preset-env',
                                    {
                                        useBuiltIns: 'usage',
                                        corejs: '3.21.1',
                                    },
                                ],
                                '@babel/preset-typescript',
                            ],
                            plugins: ['@babel/plugin-transform-runtime'],
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        /** 如果一个模块源码大小小于 maxSize，那么模块会被作为一个 Base64 编码
                        的字符串注入到包中， 否则模块文件会被生成到输出的目标目录中。*/
                        maxSize: 8 * 1024, // 8kb
                    },
                },
                generator: {
                    filename: 'static/images/[hash][ext][query]',
                },
            },
            {
                // 加载 fonts 字体
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/font/[hash][ext][query]',
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader', //因为loader的规则是链式处理，postcss-loader是处理css的，所以放在css之后，而不是less之后
                    'sass-loader',
                ],
            },
        ],
    },
};
