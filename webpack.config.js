const path = require('path');
module.exports = {
  mode: 'production',
  entry: './out/index.js',
  resolve: {
    alias: { "@": path.resolve(__dirname, "out") }
  },
  output: {
    path: path.resolve(__dirname, 'pages/game'),
    filename: 'index.js'
  }
};
