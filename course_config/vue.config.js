const path = require('path');
const { name } = require('./package.json');

const port = 60001;

// 资源文件路径处理
let publicPath = `//localhost:${port}`;

module.exports = {
  publicPath,
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '-': path.resolve(__dirname, 'src/common'),
        '~': path.resolve(__dirname, 'src/components')
      }
    },
    devtool: false
  },
  devServer: {
    port,
    open: true,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
};
