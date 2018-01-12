const path = require('path');

module.exports = {
    entry: './scripts/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
      },
      devServer: {
        contentBase: './dist'
        },
      
      module: {
             rules: [
               {
                 test: /\.css$/,
                 use: [
                   'style-loader',
                   'css-loader'
                 ]
               }
             ]}
};