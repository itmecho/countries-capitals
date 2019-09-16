import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: [{
    file: 'dist/index.js',
    format: 'cjs'
  },
  {
    name: 'CountriesCapital',
    file: 'dist/index.umd.js',
    format: 'umd'
  }],
  plugins: [
    json(),
    resolve(),
    commonJS({
      namedExports: {
        'random-item': ['randomItem']
      }
    })
  ]
};