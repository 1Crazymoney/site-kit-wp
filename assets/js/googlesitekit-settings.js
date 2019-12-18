/**
 * Settings component.
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
/* eslint camelcase:[0] */

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';
import { setLocaleData } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';
import { Component, render } from '@wordpress/element';

/**
 * Internal dependencies
 */
// eslint-disable-next-line @wordpress/dependency-group
import ErrorHandler from 'GoogleComponents/ErrorHandler';
import SettingsApp from 'GoogleComponents/settings/settings-app';

class GoogleSitekitSettings extends Component {
	constructor( props ) {
		super( props );

		// Set up translations.
		setLocaleData( googlesitekit.locale, 'google-site-kit' );
	}

	render() {
		return (
			<ErrorHandler>
				<SettingsApp />
			</ErrorHandler>
		);
	}
}

// Initialize the app once the DOM is ready.
domReady( function() {
	const settingsWrapper = document.getElementById( 'googlesitekit-settings-wrapper' );
	if ( null !== settingsWrapper ) {
		// Render the Settings App.
		render( <GoogleSitekitSettings />, settingsWrapper );

		/**
		 * Action triggered when the settings App is loaded.
		 */
		doAction( 'googlesitekit.moduleLoaded', 'Settings' );
	}
} );
