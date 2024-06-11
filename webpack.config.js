const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    previewModal: './src/preview/PreviewModal.tsx',
    previewOptions: './src/preview/PreviewOptions.tsx',
    previewPopup: './src/preview/PreviewPopup.tsx',
    previewSummarizer: './src/preview/PreviewSummarizer.tsx',
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
            // Add custom attribute to the head styles.
            options: {
              insert: 'head',
              attributes: { 'data-tw-summarizer': 'true' },
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  // Preview how these components will look and behave in dev mode.
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/preview/modal.html',
      filename: 'preview/modal.html',
      chunks: ['previewModal'],
    }),
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
    new HtmlWebpackPlugin({
      template: './public/preview/summarizer.html',
      filename: 'preview/summarizer.html',
      chunks: ['previewSummarizer'],
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
