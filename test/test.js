import * as path from 'path';
import * as assert from 'assert';
import { SourceMapConsumer } from 'source-map';
import { rollup } from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import esnext from '..';

process.chdir( __dirname );

function executeBundle ( bundle ) {
	const generated = bundle.generate({
		format: 'cjs'
	});

	const fn = new Function ( 'module', 'assert', generated.code );
	let module = {};

	fn( module, assert );

	return module;
}

describe( 'rollup-plugin-esnext', () => {
	it( 'converts a basic esnext module', () => {
		return rollup({
			entry: 'samples/basic/main.js',
			plugins: [ esnext() ]
		}).then( bundle => {
			assert.equal( executeBundle( bundle ).exports, 42 );
		});
	});

	it( 'converts a esnext module that mutates exports instead of replacing', () => {
		return rollup({
			entry: 'samples/exports/main.js',
			plugins: [ esnext() ]
		}).then( bundle => {
			assert.equal( executeBundle( bundle ).exports, 'BARBAZ' );
		});
	});

	it( 'finds index.js files', () => {
		return rollup({
			entry: 'samples/index/main.js',
			plugins: [ esnext() ]
		}).then( executeBundle );
	});

	it( 'handles imports with a trailing slash', () => {
		// yes this actually happens. Not sure why someone would do this
		// https://github.com/nodejs/readable-stream/blob/077681f08e04094f087f11431dc64ca147dda20f/lib/_stream_readable.js#L125
		return rollup({
			entry: 'samples/trailing-slash/main.js',
			plugins: [ esnext() ]
		}).then( executeBundle );
	});

	it( 'handles imports with a non-extension dot', () => {
		return rollup({
			entry: 'samples/dot/main.js',
			plugins: [ esnext() ]
		}).then( executeBundle );
	});

	it( 'handles shadowed require', () => {
		return rollup({
			entry: 'samples/shadowing/main.js',
			plugins: [ esnext() ]
		}).then( executeBundle );
	});

	it( 'identifies named exports', () => {
		return rollup({
			entry: 'samples/named-exports/main.js',
			plugins: [ esnext() ]
		}).then( executeBundle );
	});

	it( 'handles bare imports', () => {
		return rollup({
			entry: 'samples/bare-import/main.js',
			plugins: [ esnext() ]
		}).then( executeBundle );
	});

	it( 'converts a commonjs module with custom file extension', () => {
		return rollup({
			entry: 'samples/extension/main.coffee',
			plugins: [ esnext({ extensions: ['.coffee' ]}) ]
		}).then( bundle => {
			assert.equal( executeBundle( bundle ).exports, 42 );
		});
	});
});
