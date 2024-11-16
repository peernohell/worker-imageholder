import terser from '@rollup/plugin-terser';
// plugin-node-resolve and plugin-commonjs are required for a rollup bundled project
// to resolve dependencies from node_modules. See the documentation for these plugins
// for more details.
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/index.mjs',
  output: {
    exports: 'named',
    format: 'es',
    file: 'dist/index.mjs',
    sourcemap: true,
  },
  external: ['./font.ttf', './Gilland-Regular.otf', './Arturito Slab.ttf', './SourceSansPro-Regular.ttf', './Roboto-Regular.ttf', './Manrope-Regular.otf'],
  plugins: [
    commonjs(),
    nodeResolve({ browser: true }),
    terser(),
    copy({
      targets: [
        { src: './src/font.ttf', dest: './dist/' },
        { src: './src/Gilland-Regular.otf', dest: './dist/' },
        { src: './src/Arturito Slab.ttf', dest: './dist/' },
        { src: './src/SourceSansPro-Regular.ttf', dest: './dist/' },
        { src: './src/Roboto-Regular.ttf', dest: './dist/' },
        { src: './src/Manrope-Regular.otf', dest: './dist/' },
      ],
    }),
  ],
}
