const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    previewOptions: './src/preview/PreviewOptions.tsx',
    previewPopup: './src/preview/PreviewPopup.tsx',
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
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: 'head',
              attributes: { 'data-tw-summarizer': 'true' },
            },
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  // Dev mode: preview components without installing the extension.
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/preview/options.html',
      filename: 'preview/options.html',
      chunks: ['previewOptions'],
    }),
    new HtmlWebpackPlugin({
      template: './public/preview/popup.html',
      filename: 'preview/popup.html',
      chunks: ['previewPopup'],
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.entry = {
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
