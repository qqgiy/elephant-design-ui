module.exports = {
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
};
