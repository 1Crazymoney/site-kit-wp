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

function DefaultModuleSettings( { slug, provides, allowEdit, onView, onEdit, onSave, onRemove } ) {
	const {
		isOpen,
		isEdit,
	} = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		return {
			isOpen: store.isSettingsOpen( slug ),
			isEdit: store.isEditingSettings( slug ),
		};
	} );

	let settingsComponent = null;
	if ( isOpen ) {
		if ( isEdit ) {
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
					<ModuleSettingsBody slug={ slug } allowEdit={ allowEdit }>
						{ settingsComponent }
					</ModuleSettingsBody>

					<ModuleSettingsFooter
						slug={ slug }
						allowEdit={ allowEdit }
						provides={ provides }
						onSave={ onSave }
						onRemove={ onRemove }
					/>
				</ModuleSettingsContainer>
			}
		</ModuleSettings>
	);
}

DefaultModuleSettings.propTypes = {
	slug: PropTypes.string.isRequired,
	provides: PropTypes.arrayOf( PropTypes.string ),
	allowEdit: PropTypes.bool,
	onView: PropTypes.func,
	onEdit: PropTypes.func,
	onSave: PropTypes.func,
	onRemove: PropTypes.func,
};

DefaultModuleSettings.defaultProps = {
	allowEdit: false,
	provides: [],
};

export default DefaultModuleSettings;
