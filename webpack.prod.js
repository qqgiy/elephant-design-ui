const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // 这个插件使用 cssnano 优化和压缩 CSS。
const TerserPlugin = require('terser-webpack-plugin'); // 这个插件使用 terser 来缩小/最小化你的 JavaScript。

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        // moduleIds: 'deterministic', // 缓存打包后的 vendor 文件（若文件不更改，则每次打包值不变。不适合react组件，只适合单纯的js文件）
        runtimeChunk: 'single', //将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中
        splitChunks: {
            // cacheGroups: {
            //     // vendor 指的是第三方库，react lodash等
            //     vendor: {
            //         test: /[\\/]node_modules[\\/]/,
            //         name: 'vendors',
            //         chunks: 'all',
            //     },
            // },
            // 提取所有的公共模块
            chunks: 'all',
        },
        // innerGraph: true,
        usedExports: true, //只导出被使用的模块
        minimize: true, // 启动压缩
        minimizer: [
            new TerserPlugin({
                extractComments: true, // 启用 / 禁用剥离注释功能。
                terserOptions: {
                    compress: {
                        pure_funcs: ['console.log'], // 去除 console.log
                        dead_code: true, // remove dead_code in functions
                        unused: true, // remove unused functions
                        keep_fnames: true,
                        keep_classnames: true,
                        keep_fargs: true,
                    },
                    // mangle: false, // don't minify variable names
                    format: {
                        // beautify: true, // 开启后，压缩将不起作用
                        comments: false,
                    },
                },
                parallel: true, // 开启“多线程”，提高压缩效率
                exclude: /node_modules/,
            }),
            // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
            // `...`,
            new CssMinimizerPlugin(),
        ],
    },
});
