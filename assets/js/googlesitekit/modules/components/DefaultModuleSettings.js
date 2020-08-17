/**
 * DefaultModuleSettings component.
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
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from '../datastore/constants';
import ModuleSettings from './ModuleSettings';
import ModuleSettingsHeader from './ModuleSettingsHeader';
import ModuleSettingsBody from './ModuleSettingsBody';
import ModuleSettingsFooter from './ModuleSettingsFooter';
import ModuleSettingsContainer from './ModuleSettingsContainer';
const { useSelect } = Data;

function DefaultModuleSettings( props ) {
	const {
		slug,
		onView,
		onEdit,
		onSave,
		canSave,
		canDisconnect,
	} = props;

	const {
		isOpen,
		isEdit,
		isSaving,
	} = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		return {
			isOpen: store.isSettingsOpen( slug ),
			isEdit: store.isEditingSettings( slug ),
			isSaving: store.isSavingSettings( slug ),
		};
	} );

	let settingsComponent = null;
	if ( isOpen ) {
		if ( isEdit || isSaving ) {
			if ( onEdit ) {
				settingsComponent = onEdit();
			}
		} else if ( onView ) {
			settingsComponent = onView();
		}
	}

	return (
		<ModuleSettings slug={ slug }>
			<ModuleSettingsHeader slug={ slug } />
			{ isOpen &&
				<ModuleSettingsContainer slug={ slug }>
					<ModuleSettingsBody slug={ slug } allowEdit={ !! onEdit }>
						{ settingsComponent }
					</ModuleSettingsBody>

					<ModuleSettingsFooter
						slug={ slug }
						allowEdit={ !! onEdit }
						onSave={ onSave }
						canSave={ canSave }
						canDisconnect={ canDisconnect }
					/>
				</ModuleSettingsContainer>
			}
		</ModuleSettings>
	);
}

DefaultModuleSettings.propTypes = {
	slug: PropTypes.string.isRequired,
	onView: PropTypes.func,
	onEdit: PropTypes.func,
	onSave: PropTypes.func,
	canSave: PropTypes.bool,
	canDisconnect: PropTypes.bool,
};

DefaultModuleSettings.defaultProps = {
	canSave: false,
	canDisconnect: false,
};

export default DefaultModuleSettings;
