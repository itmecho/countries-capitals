import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';

export default {
  input: 'dist/index.js',
  output: {
    name: 'CountriesCapital',
    file: 'dist/index.umd.js',
    format: 'umd'
  },
  plugins: [
    json(),
    resolve(),
    commonJs({
      namedExports: {
        'random-item': ['randomItem']
      }
    })
  ]
};