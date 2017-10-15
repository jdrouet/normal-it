import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';

const isProduction = process.env.NODE_ENV === 'production';

const destBase = 'dist/normal-it';
const destExtension = `${isProduction ? '.min' : ''}.js`;

export default {
  input: 'source/index.js',
  name: 'normalIt',
  output: [
    { file: `${destBase}${destExtension}`, format: 'cjs' },
    { file: `${destBase}.umd${destExtension}`, format: 'umd' },
    { file: `${destBase}.amd${destExtension}`, format: 'amd' },
    { file: `${destBase}.browser${destExtension}`, format: 'iife' },
  ],
  plugins: [
    babel({ babelrc: false, presets: ['es2015-rollup', 'stage-1'] }),
    isProduction && uglify(),
    filesize(),
  ].filter(plugin => !!plugin),
};
