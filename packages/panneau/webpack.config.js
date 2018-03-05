/* eslint-disable import/no-extraneous-dependencies */
const webpackMerge = require('webpack-merge');
const webpackConfig = require('../../build/webpack.config.panneau');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = () => (
    webpackMerge(webpackConfig('umd'), {
        entry: {
            panneau: [
                './path',
                './index',
            ],
        },
    })
);
