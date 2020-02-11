/**
 * Backstop config.
 *
 * Site Kit by Google, Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const scenariosData = require( './scenarios-data' );
const hostname = require( './detect-target-host' );
const scenarios = scenariosData( `http://${ hostname }:9001/iframe.html?id=` );

// If this is run from the host, set the hostname arg.
if ( process.argv.find( ( arg ) => arg.match( /^--docker$/ ) ) ) {
	process.argv.push( `--hostname=${ hostname }` );
}

module.exports = {
	onBeforeScript: 'puppet/onBefore.js',
	asyncCaptureLimit: 5,
	asyncCompareLimit: 50,
	debug: false,
	debugWindow: false,
	engine: 'puppeteer',
	engineOptions: {
		args: [ '--no-sandbox' ],
	},
	id: 'google-site-kit',
	paths: {
		bitmaps_reference: 'tests/backstop/reference',
		bitmaps_test: 'tests/backstop/tests',
		engine_scripts: 'tests/backstop/engine_scripts',
		html_report: 'tests/backstop/html_report',
		ci_report: 'tests/backstop/ci_report',
	},
	report: [ 'browser' ],
	scenarios,
	viewports: require( './viewports' ),
	readyEvent: 'backstopjs_ready',
	misMatchThreshold: 0.05, // @todo change to 0, resolve SVG issue.
	delay: 1000, // Default delay to ensure components render in Travis.
};
