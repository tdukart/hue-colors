const babel = require( 'rollup-plugin-babel' );
const commonjs = require( 'rollup-plugin-commonjs' );
const resolve = require( 'rollup-plugin-node-resolve' );
const url = require( 'rollup-plugin-url' );
const jsdoc = require( 'rollup-plugin-jsdoc' );

const pkg = require( './package.json' );

module.exports = {
    input: 'src/index.js',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
            sourcemap: true,
        },
    ],
    plugins: [
        babel( {
            exclude: 'node_modules/**'
        } ),
        url(),
        resolve(),
        commonjs(),
        jsdoc(),
    ],
}
