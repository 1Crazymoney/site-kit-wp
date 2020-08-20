/**
 * Tag Manager Setup Form component.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useEffect, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME, FORM_SETUP, EDIT_SCOPE } from '../../datastore/constants';
import { STORE_NAME as MODULES_ANALYTICS } from '../../../analytics/datastore/constants';
import { STORE_NAME as CORE_FORMS } from '../../../../googlesitekit/datastore/forms/constants';
import { STORE_NAME as CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import { STORE_NAME as CORE_MODULES } from '../../../../googlesitekit/modules/datastore/constants';
import { isPermissionScopeError } from '../../../../googlesitekit/datastore/user/utils/is-permission-scope-error';
import {
	AccountSelect,
	AMPContainerSelect,
	FormInstructions,
	WebContainerSelect,
} from '../common';
import StoreErrorNotice from '../../../../components/StoreErrorNotice';
import SetupFormSubmitButtons from './SetupFormSubmitButtons';
const { useSelect, useDispatch } = Data;

export default function SetupForm( { finishSetup, setIsNavigating } ) {
	const gtmAnalyticsPropertyID = useSelect( ( select ) => select( STORE_NAME ).getSingleAnalyticsPropertyID() );
	const analyticsModuleActive = useSelect( ( select ) => select( CORE_MODULES ).isModuleActive( 'analytics' ) );
	const hasEditScope = useSelect( ( select ) => select( CORE_USER ).hasScope( EDIT_SCOPE ) );
	const autoSubmit = useSelect( ( select ) => select( CORE_FORMS ).getValue( FORM_SETUP, 'autoSubmit' ) );
	const submitMode = useSelect( ( select ) => select( CORE_FORMS ).getValue( FORM_SETUP, 'submitMode' ) );
	const analyticsModuleReauthURL = useSelect( ( select ) => select( MODULES_ANALYTICS ).getAdminReauthURL() );

	const { setValues } = useDispatch( CORE_FORMS );
	const { activateModule } = useDispatch( CORE_MODULES );
	const { submitChanges } = useDispatch( STORE_NAME );
	const dispatchAnalytics = useDispatch( MODULES_ANALYTICS );
	const submitForm = useCallback( async ( { submitMode } ) => { // eslint-disable-line no-shadow
		// We'll use form state to persist the chosen submit choice
		// in order to preserve support for auto-submit.
		setValues( FORM_SETUP, { submitMode } );

		const { error } = await submitChanges();

		if ( isPermissionScopeError( error ) ) {
			setValues( FORM_SETUP, { autoSubmit: true } );
		} else if ( ! error ) {
			setValues( FORM_SETUP, { autoSubmit: false } );
			// If the property ID is set in GTM and Analytics is active,
			// we disable the snippet output via Analyics to prevent duplicate measurement.
			if ( gtmAnalyticsPropertyID && analyticsModuleActive ) {
				dispatchAnalytics.setUseSnippet( false );
				await dispatchAnalytics.saveSettings();
			}
			// If submitting with Analytics setup, and Analytics is not active,
			// activate it, and navigate to its reauth/setup URL to proceed with its setup.
			if ( submitMode === 'with_analytics_setup' && ! analyticsModuleActive ) {
				setIsNavigating( true );
				await activateModule( 'analytics' );
				global.location.assign( analyticsModuleReauthURL );
				// Don't call finishSetup as this navigates to a different location.
				return;
			}
			finishSetup();
		}
	}, [ finishSetup, dispatchAnalytics, gtmAnalyticsPropertyID, analyticsModuleActive, analyticsModuleReauthURL ] );

	// If the user lands back on this component with autoSubmit and the edit scope,
	// resubmit the form.
	useEffect( () => {
		if ( autoSubmit && hasEditScope ) {
			submitForm( { submitMode } );
		}
	}, [ hasEditScope, autoSubmit, submitForm, submitMode ] );

	// Form submit behavior now varies based on which button is clicked,
	// so we no longer support the generic form submit event.
	const preventDefaultFormSubmit = useCallback( ( event ) => event.preventDefault() );

	return (
		<form
			className="googlesitekit-tagmanager-setup__form"
			onSubmit={ preventDefaultFormSubmit }
		>
			<StoreErrorNotice storeName={ STORE_NAME } />
			<FormInstructions />

			<div className="googlesitekit-setup-module__inputs">
				<AccountSelect />

				<WebContainerSelect />

				<AMPContainerSelect />
			</div>

			<SetupFormSubmitButtons submitForm={ submitForm } />
		</form>
	);
}

SetupForm.propTypes = {
	finishSetup: PropTypes.func,
	setIsNavigating: PropTypes.func,
};
