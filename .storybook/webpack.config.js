const path = require('path');
const glob = require('glob');

const CSS_NAME = 'panneau-[name]-[local]';

module.exports = (storybookBaseConfig, configType) => {
    // Alias packages
    const alias = {};
    const exactPackages = [
        'lodash',
        'babel-runtime',
    ];
    const lernaConfig = require('../lerna.json');
    lernaConfig.packages.forEach((packagesPath) => {
        const packages = glob.sync(path.join(__dirname, '../', packagesPath));
        packages.forEach((packagePath) => {
            const packageJSON = require(path.resolve(packagePath, './package.json'));
            alias[packageJSON.name] = path.resolve(packagePath, './src/index');
            const dependencies = []
                .concat(Object.keys(packageJSON.dependencies))
                .concat(Object.keys(packageJSON.devDependencies));
            dependencies.forEach((name) => {
                if (name.match(/^\@react-panneau/)) {
                    return;
                }
                const aliasPath = path.resolve(__dirname, `../node_modules/${name}`)
                if (exactPackages.indexOf(name) !== -1) {
                    alias[`${name}$`] = aliasPath;
                } else {
                    alias[name] = aliasPath;
                }
            });
        });
    });
    storybookBaseConfig.resolve.alias = alias;

    // Exclude all node_modules folders
    storybookBaseConfig.module.rules[0].exclude.push(/node_modules/);

    // CSS loaders
    const styleLoader = {
        loader: 'style-loader',
        options: {
            sourceMap: true,
        },
    };

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: true,
            localIdentName: CSS_NAME,
        },
    };

    const postCssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: true,
            config: {
                path: path.resolve(__dirname, '../build/postcss.config.js'),
                ctx: {
                    env: 'dev',
                },
            },
        },
    };

    const sassLoader = {
        loader: 'sass-loader',
        options: {
            sourceMap: true,
            includePaths: [
                path.resolve(__dirname, '../node_modules'),
            ],
        },
    };

    storybookBaseConfig.module.rules.push({
        test: /\.global\.scss$/,
        loaders: [
            styleLoader,
            cssLoader,
            postCssLoader,
            sassLoader,
        ],
    });

    storybookBaseConfig.module.rules.push({
        test: /\.scss$/,
        exclude: /\.global\.scss$/,
        loaders: [
            styleLoader,
            {
                ...cssLoader,
                options: {
                    ...cssLoader.options,
                    modules: true,
                    importLoaders: 2,
                },
            },
            postCssLoader,
            sassLoader,
        ],
    });

    storybookBaseConfig.module.rules.push({
        test: /\.(ttf|eot|woff|woff2|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        include: /fonts\//,
        options: {
            limit: 1000,
            name: 'fonts/[name]-[hash:6].[ext]',
            publicPath: '',
        },
    });

    // For sub packages
    storybookBaseConfig.module.rules.push({
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
    });

    return storybookBaseConfig;
};
