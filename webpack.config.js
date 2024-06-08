const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
  entry: {
    modalTest: './src/uiTest/modalTest.tsx',
    summarizerTest: './src/uiTest/summarizerTest.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/modalTest.html',
      filename: 'modalTest.html',
      chunks: ['modalTest'],
    }),
    new HtmlWebpackPlugin({
      template: './public/summarizerTest.html',
      filename: 'summarizerTest.html',
      chunks: ['summarizerTest'],
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.entry = {
      // These are the browser extension needed files.
      ['scripts/content']: './src/contentScript.tsx',
      background: './src/background.ts',
      options: './src/options.tsx',
      popup: './src/popup.tsx',
    };
    config.plugins = [
      new HtmlWebpackPlugin({
        template: './public/options.html',
        filename: 'options.html',
        chunks: ['options'],
      }),
      new HtmlWebpackPlugin({
        template: './public/popup.html',
        filename: 'popup.html',
        chunks: ['popup'],
      }),
      new CopyPlugin({
        patterns: [{ from: 'public/manifest.json', to: 'manifest.json' }],
      }),
      new CopyPlugin({
        patterns: [{ from: 'public/images/', to: 'images/' }],
      }),
    ];
  }

  return config;
};
