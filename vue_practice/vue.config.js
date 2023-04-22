const path = require('path');
const { name } = require('./package.json');

const port = 60001;

// 资源文件路径处理
// 开发环境默认 '/'
const _isDEV = process.env.NODE_ENV === 'development';
let publicPath = _isDEV ? '/' : `/${name}/`;

module.exports = {
  publicPath,
  configureWebpack: {
    output: {
      library: `${name}`,
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
