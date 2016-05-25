var webpack = require('webpack');
var path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {presets:['react']},
      },
      {
        test: /\.s?css$/,
        // Query parameters are passed to node-sass
        loader: 'style!css!sass?outputStyle=expanded&' +
          'includePaths[]=' + (path.resolve(__dirname, './node_modules'))
      },
    ],
  },

  entry: './src/react-xzibit-select.js',

  output: {
    library: 'ReactXzibitSelect',
    libraryTarget: 'umd',
    path: 'dist',
    filename: 'react-xzibit-select.js',
  },

  externals: {
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    },
    'classnames': {
      root: 'classes',
      commonjs: 'classnames',
      commonjs2: 'classnames',
      amd: 'classnames',
    },
    'opentip': {
      root: 'Opentip',
      commonjs: 'opentip',
      commonjs2: 'opentip',
      amd: 'opentip',
    },
    'react-compact-multiselect': {
      root: 'ReactCompactMultiselect',
      commonjs: 'react-compact-multiselect',
      commonjs2: 'react-compact-multiselect',
      amd: 'react-compact-multiselect',
    },
    'react-ismobile-mixin': {
      root: 'IsMobileMixin',
      commonjs: 'react-ismobile-mixin',
      commonjs2: 'react-ismobile-mixin',
      amd: 'react-ismobile-mixin',
    },
    'react-lazy-render': {
      root: 'LazyRender',
      commonjs: 'react-lazy-render',
      commonjs2: 'react-lazy-render',
      amd: 'react-lazy-render',
    },
    'react-sizebox': {
      root: 'ReactSizeBox',
      commonjs: 'react-sizebox',
      commonjs2: 'react-sizebox',
      amd: 'react-sizebox',
    },
    'react-skylight': {
      root: 'SkyLight',
      commonjs: 'react-skylight',
      commonjs2: 'react-skylight',
      amd: 'react-skylight',
    },
    'react-tag-list': {
      root: 'TagList',
      commonjs: 'react-tag-list',
      commonjs2: 'react-tag-list',
      amd: 'react-tag-list',
    },
    'react-addons-update': {
      root: 'update',
      commonjs: 'react-addons-update',
      commonjs2: 'react-addons-update',
      amd: 'react-addons-update',
    },
  },

  node: {
    Buffer: false
  },

};
