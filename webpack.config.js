const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const filename = (ext) => (isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`);

const jsLoaders = () => {
    const loaders = [
        {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"],
                plugins: ["@babel/plugin-proposal-class-properties"],
            },
        },
    ];
    return loaders;
};

console.log("IS PRODUCTION", isProd);
console.log("IS DEVELOPMENT", isDev);

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: ["@babel/polyfill", "./index.js"],
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist"),
    },
    //NOTE/: ALIAS PATH
    resolve: {
        extensions: [".js"],
        alias: {
            "@": path.resolve((__dirname, "src")),
            "@core": path.resolve((__dirname, "src/core")),
        },
    },
    devtool: isDev ? "source-map" : false,
    devServer: {
        port: 3000,
        hot: isDev,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "index.html",

            minify: {
                // NOTE: Удаление коментов если это режи PRODUCTION
                removeComments: isProd,
                // NOTE: Удаление пробелов если это режи PRODUCTION
                collapseWhitespace: isProd,
            },
        }),
        new CopyPlugin([
            {
                from: path.resolve(__dirname, "src/favicon.ico"),
                to: path.resolve(__dirname, "dist"),
            },
        ]),
        new MiniCssExtractPlugin({
            filename: filename("css"),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                        },
                    },
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders(),
            },
        ],
    },
};
