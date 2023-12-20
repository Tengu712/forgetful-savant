const path = require('path');
module.exports = {
  mode: 'production',
  entry: './out/index.js',
  output: {
    path: path.resolve(__dirname, 'pages/game'),
    filename: 'index.js'
  }
};
