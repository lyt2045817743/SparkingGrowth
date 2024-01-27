const path = require('path');
const { name } = require('./package.json');

const port = 63001;

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
    open: false,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, 'src/style/_variables.scss')]
    }
  }
};
