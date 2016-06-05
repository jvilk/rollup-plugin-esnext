# rollup-plugin-esnext

Convert CommonJS modules to ES6 so they can be included in a Rollup bundle.
Uses the excellent [esnext](https://github.com/esnext/esnext) module to perform conversions.

## Installation

    $ npm install --save-dev rollup-plugin-esnext

## Usage

```js
import { rollup } from 'rollup';
import esnext from 'rollup-plugin-esnext';

rollup({
  entry: 'main.js',
  plugins: [
    esnext({
      // We attempt to ignore non-CommonJS modules, but might be wrong!
      // Use this to specifically include/exclude particular files.
      include: 'node_modules/**',  // Default: undefined
      exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined

      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      extensions: [ '.js', '.coffee' ]  // Default: [ '.js' ]
    })
  ]
}).then(...)
```

## License

MIT