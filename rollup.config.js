import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default {
	entry: 'src/index.js',
	plugins: [
        json(),
		babel({
			exclude: ['node_modules/**']
		}),
		nodeResolve({
			jsnext: true
		}),
		commonjs()
	],
	format: 'cjs',
	dest: 'tmp/lambda/index.js',
	external: ['aws-sdk']
};
