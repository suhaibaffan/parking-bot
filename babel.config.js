module.exports = {
    plugins: [
        [
            '@babel/plugin-proposal-decorators',
            {
                decoratorsBeforeExport: false
            }
        ],
        '@babel/plugin-syntax-bigint',
        '@babel/plugin-proposal-function-bind',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-class-properties',
        [
            'babel-plugin-inline-import',
            {
                extensions: [ '.mjml' ]
            }
        ]
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current'
                }
            }
        ]
    ]
};
