import {createFilter} from 'rollup-pluginutils';
import {resolve, dirname, sep, extname} from 'path';
import {statSync} from 'fs';
import {convert} from 'esnext';

const firstpass = /\b(?:require|exports)\b/;

function getCandidatesForExtension (resolved, extension) {
	return [
		resolved + extension,
		resolved + `${sep}index${extension}`
	];
}

function getCandidates (resolved, extensions) {
	return extensions.reduce(
		( paths, extension ) => paths.concat(getCandidatesForExtension ( resolved, extension )),
		[resolved]
	);
}

export default function esnext (options = {}) {
	const extensions = options.extensions || ['.js'];
	const filter = createFilter( options.include, options.exclude );

	return {
		resolveId ( importee, importer ) {
			if ( importee[0] !== '.' ) return; // not our problem

			const resolved = resolve( dirname( importer ), importee );
			const candidates = getCandidates( resolved, extensions );

			for (let i = 0; i < candidates.length; i += 1) {
				try {
					const stats = statSync( candidates[i] );
					if ( stats.isFile() ) return candidates[i];
				} catch ( err ) { /* noop */ }
			}
		},

		transform (code, id) {
			if ( !filter( id ) ) return null;
			if ( extensions.indexOf(extname( id )) === -1) return null;
			if ( !firstpass.test( code ) ) return null;

			const converted = convert(code);

			return { code: converted.code, map: converted.map};
		},

		intro () {
			return '';
		}
	};
}