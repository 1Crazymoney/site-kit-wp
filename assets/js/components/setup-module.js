/**
 * SetupModule component.
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

/**
 * External dependencies
 */
// import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import {
	activateOrDeactivateModule,
	getReAuthURL,
	showErrorNotification,
	getModulesData,
} from '../util';
import { refreshAuthentication } from '../util/refresh-authentication';
import data from '../components/data';
import ModuleIcon from '../components/module-icon';
import Spinner from './Spinner';
import Link from './Link';
import ModuleSettingsWarning from '../components/notifications/module-settings-warning';
import GenericError from '../components/notifications/generic-error';

export default function SetupModule( {
	slug,
	name,
	description,
	active,
	showLink,
} ) {
	const [ isSaving, setIsSaving ] = useState( false );

	const activateOrDeactivate = async () => {
		try {
			// this.setState( { isSaving: true } );
			setIsSaving( true );
			await activateOrDeactivateModule( data, slug, ! active );

			await refreshAuthentication();

			// Redirect to ReAuthentication URL.
			global.location = getReAuthURL( slug, true );
		} catch ( err ) {
			showErrorNotification( GenericError, {
				id: 'activate-module-error',
				title: __( 'Internal Server Error', 'google-site-kit' ),
				description: err.message,
				format: 'small',
				type: 'win-error',
			} );
			// this.setState( { isSaving: false } );
			setIsSaving( false );
		}
	};

	let blockedByParentModule = false;
	let parentModule;

	const modules = getModulesData();

	// Check if required module is active.
	if ( modules[ slug ].required.length ) {
		const requiredModules = modules[ slug ].required;

		requiredModules.forEach( ( requiredModule ) => {
			if ( ! modules[ requiredModule ].setupComplete ) {
				blockedByParentModule = true;
				parentModule = modules[ requiredModule ].name;
			}
		} );
	}

	return (
		<div
			className={ classnames(
				'googlesitekit-settings-connect-module',
				`googlesitekit-settings-connect-module--${ slug }`,
				{ 'googlesitekit-settings-connect-module--disabled': blockedByParentModule }
			) }
			key={ slug }
		>
			<div className="googlesitekit-settings-connect-module__switch">
				<Spinner isSaving={ isSaving } />
			</div>
			<div className="googlesitekit-settings-connect-module__logo">
				<ModuleIcon slug={ slug } />
			</div>
			<h3 className="
					googlesitekit-subheading-1
					googlesitekit-settings-connect-module__title
				">
				{ name }
			</h3>
			<p className="googlesitekit-settings-connect-module__text">
				{ description }
			</p>

			<ModuleSettingsWarning slug={ slug } context="modules-list" />

			{ applyFilters( 'googlesitekit.SetupModuleShowLink', showLink, slug ) &&
				<p className="googlesitekit-settings-connect-module__cta">
					<Link
						onClick={ activateOrDeactivate }
						href=""
						inherit
						disabled={ blockedByParentModule }
						arrow
					>
						{
							! blockedByParentModule
								? sprintf(
								/* translators: %s: module name */
									__( 'Set up %s', 'google-site-kit' ),
									name
								)
								: sprintf(
								/* translators: 1: required module name 2: module name */
									__( 'Set up %1$s to gain access to %2$s', 'google-site-kit' ),
									parentModule,
									name
								)
						}
					</Link>
				</p>
			}
		</div>
	);
}
