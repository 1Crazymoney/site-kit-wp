/**
 * External dependencies
 */
import gulp from 'gulp';
import zip from 'gulp-zip';
import del from 'del';
import fs from 'fs';
import path from 'path';
import getRepoInfo from 'git-repo-info';

function getPluginVersion() {
	return fs.readFileSync( path.resolve( __dirname, '../google-site-kit.php' ), 'utf8' )
		.match( /Version:\s+([0-9\.\w-]+)/ )
		[ 1 ];
}

function getGit() {
	const { abbreviatedSha, branch, committerDate } = getRepoInfo();
	return {
		branch: branch.replace( /[\\\/]/, '|' ),
		date: committerDate.replace( 'T', '~' ).replace( /\..*/, '' ),
		shortSha: abbreviatedSha,
	};
}

function generateFilename() {
	const version = getPluginVersion();
	const { branch, date, shortSha } = getGit();
	return `google-site-kit.v${ version }:${ branch }@${ shortSha }_${ date }.zip`;
}



gulp.task( 'zip', () => {
	const filename = generateFilename();
	del.sync( path.resolve( __dirname, `../${ filename }` ) );
	gulp.src(
		[ 'release/google-site-kit/**' ],
		{ base: 'release/' }
	)
		.pipe( zip( generateFilename() ) )
		.pipe( gulp.dest( './' ) );

	// eslint-disable-next-line no-console
	console.log( `Generated ${ filename }` );
} );
