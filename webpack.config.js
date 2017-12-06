const path = require('path');

module.exports = {
    entry: './src/js/index',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, "src")
                ],
                test: /\.js$/
            },
            {
                loader: 'style-loader!css-loader!sass-loader',
                include: [
                    path.resolve(__dirname, "src")
                ],
                test: /\.scss$/
            }
        ]
    }
};
