/**
 * ModuleSettingsFooter component.
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
import { __, sprintf } from '@wordpress/i18n';
import { Fragment, useCallback } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { clearWebStorage } from '../../../util';
import Button from '../../../components/button';
import Link from '../../../components/link';
import Spinner from '../../../components/spinner';
import SvgIcon from '../../../util/svg-icon';
import { STORE_NAME } from '../datastore/constants';
const { useDispatch, useSelect } = Data;

function ModuleSettingsFooter( { allowEdit, handleDialog, slug } ) {
	const {
		module,
		isEditing,
		isSavingModuleSettings,
	} = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		return {
			module: store.getModule( slug ),
			isEditing: store.isEditingSettings( slug ),
			isSavingModuleSettings: store.isSavingSettings( slug ),
		};
	} );

	const { setSettingsDisplayMode } = useDispatch( STORE_NAME );
	const handleEdit = useCallback( ( action ) => {
		if ( action === 'confirm' ) {
			const modulePromise = applyFilters( 'googlekit.SettingsConfirmed', false, slug );
			setSettingsDisplayMode( slug, 'saving' );

			if ( ! modulePromise ) {
				// Clears session and local storage on successful setting.
				clearWebStorage();
				return;
			}

			modulePromise.then( () => {
				// Clears session and local storage on every successful setting.
				clearWebStorage();
				// TODO Set error to false
				// Change status from 'saving' to 'view'.
				setSettingsDisplayMode( slug, 'view' );
			} ).catch( () => {
				// TODO: Set error in store.
				// Change status from 'saving' to 'view'.
				setSettingsDisplayMode( slug, 'view' );
			} );

			setSettingsDisplayMode( slug, 'view' );
		} else {
			// TODO: Set error to false.
			setSettingsDisplayMode( slug, action === 'cancel' ? 'view' : 'edit' );
		}
	}, [ slug ] );

	const { autoActivate, homepage, name, setupComplete } = module;

	// Set button text based on state.
	let buttonText = __( 'Close', 'google-site-kit' );
	if ( allowEdit && setupComplete ) {
		buttonText = isSavingModuleSettings
			? __( 'Saving…', 'google-site-kit' )
			: __( 'Confirm Changes', 'google-site-kit' );
	}

	return (
		<footer className="googlesitekit-settings-module__footer">
			<div className="mdc-layout-grid">
				<div className="mdc-layout-grid__inner">
					<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6-desktop mdc-layout-grid__cell--span-8-tablet mdc-layout-grid__cell--span-4-phone">
						{ isEditing || isSavingModuleSettings ? (
							<Fragment>
								<Button
									id={ allowEdit && setupComplete ? `confirm-changes-${ slug }` : `close-${ slug }` }
									onClick={ () => handleEdit( allowEdit && setupComplete ? 'confirm' : 'cancel' ) }
									disabled={ isSavingModuleSettings }
								>
									{ buttonText }
								</Button>
								<Spinner isSaving={ isSavingModuleSettings } />
								{ allowEdit &&
									<Link className="googlesitekit-settings-module__footer-cancel" inherit onClick={ () => handleEdit( 'cancel' ) }>
										{ __( 'Cancel', 'google-site-kit' ) }
									</Link>
								}
							</Fragment>
						) : ( ( allowEdit || ! autoActivate ) &&
							<Link className="googlesitekit-settings-module__edit-button" inherit onClick={ () => handleEdit( 'edit' ) }>
								{ __( 'Edit', 'google-site-kit' ) }
								<SvgIcon
									className="googlesitekit-settings-module__edit-button-icon"
									id="pencil"
									width="10"
									height="10"
								/>
							</Link>
						) }
					</div>
					<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6-desktop mdc-layout-grid__cell--span-8-tablet mdc-layout-grid__cell--span-4-phone mdc-layout-grid__cell--align-middle mdc-layout-grid__cell--align-right-desktop">
						{ isEditing && ! autoActivate && (
							<Link className="googlesitekit-settings-module__remove-button" inherit danger onClick={ handleDialog }>
								{
									/* translators: %s: module name */
									sprintf( __( 'Disconnect %s from Site Kit', 'google-site-kit' ), name )
								}
								<SvgIcon
									className="googlesitekit-settings-module__remove-button-icon"
									id="trash"
									width="13"
									height="13"
								/>
							</Link>
						) }
						{ ! isEditing && (
							<Link href={ homepage } className="googlesitekit-settings-module__cta-button" inherit external>
								{
									/* translators: %s: module name */
									sprintf( __( 'See full details in %s', 'google-site-kit' ), name )
								}
							</Link>
						) }
					</div>
				</div>
			</div>
		</footer>
	);
}

ModuleSettingsFooter.propTypes = {
	slug: PropTypes.string.isRequired,
	allowEdit: PropTypes.bool,
};

ModuleSettingsFooter.defaultProps = {
	allowEdit: false,
};

export default ModuleSettingsFooter;
