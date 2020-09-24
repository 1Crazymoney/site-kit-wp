/**
 * core/modules data store: settings-view tests.
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
 * Internal dependencies
 */
import { createTestRegistry } from '../../../../../tests/js/utils';
import { STORE_NAME } from './constants';

describe( 'core/modules settings-view', () => {
	let registry;
	let store;

	beforeEach( async () => {
		registry = createTestRegistry();
		store = registry.stores[ STORE_NAME ].store;
	} );

	describe( 'actions', () => {
		describe( 'setSettingsViewCurrentModule', () => {
			it( 'sets the current module with the given module slug', () => {
				expect( store.getState().settingsView.currentModule ).toBe( '' );

				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );

				expect( store.getState().settingsView.currentModule ).toBe( 'test-module' );
			} );

			it( 'accepts an empty string as no current module', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( '' );

				expect( store.getState().settingsView.currentModule ).toBe( '' );
			} );

			it( 'requires a string for the module slug', () => {
				const { setSettingsViewCurrentModule } = registry.dispatch( STORE_NAME );
				expect( () => setSettingsViewCurrentModule( '' ) ).not.toThrow();
				expect( () => setSettingsViewCurrentModule( null ) ).toThrow();
				expect( () => setSettingsViewCurrentModule( false ) ).toThrow();
				expect( () => setSettingsViewCurrentModule( true ) ).toThrow();
				expect( () => setSettingsViewCurrentModule( {} ) ).toThrow();
			} );
		} );

		describe( 'setSettingsViewIsEditing', () => {
			it( 'sets the isEditing value for the settings view', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );
				expect( store.getState().settingsView.isEditing ).toBe( false );

				registry.dispatch( STORE_NAME ).setSettingsViewIsEditing( true );

				expect( store.getState().settingsView.isEditing ).toBe( true );
			} );

			it( 'can only be set to `true` if there is a current module set', () => {
				expect( store.getState().settingsView.isEditing ).toBe( false );
				expect( store.getState().settingsView.currentModule ).toBe( '' );

				registry.dispatch( STORE_NAME ).setSettingsViewIsEditing( true );

				expect( store.getState().settingsView.isEditing ).toBe( false );
			} );
		} );

		describe( 'toggleSettingsViewModuleOpen', () => {
			it( 'sets the current module to the given slug when it is not the current', () => {
				expect( store.getState().settingsView.currentModule ).toBe( '' );

				registry.dispatch( STORE_NAME ).toggleSettingsViewModuleOpen( 'test-module' );

				expect( store.getState().settingsView.currentModule ).toBe( 'test-module' );
			} );

			it( 'unsets the current module when it is the same as the given slug', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );

				registry.dispatch( STORE_NAME ).toggleSettingsViewModuleOpen( 'test-module' );

				expect( store.getState().settingsView.currentModule ).toBe( '' );
			} );
		} );
	} );

	describe( 'selectors', () => {
		describe( 'getSettingsViewCurrentModule', () => {
			it( 'returns the module slug of the current settings view module when set', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );
				expect(
					registry.select( STORE_NAME ).getSettingsViewCurrentModule()
				).toBe( 'test-module' );
			} );

			it( 'returns an empty string when there is no current module', () => {
				expect(
					registry.select( STORE_NAME ).getSettingsViewCurrentModule()
				).toBe( '' );
			} );
		} );

		describe( 'getSettingsViewModuleState', () => {
			it( 'returns "closed" for any module other than the current when not editing', () => {
				expect(
					registry.select( STORE_NAME ).getSettingsViewCurrentModule()
				).toBe( '' );
				expect( registry.select( STORE_NAME ).isSettingsViewEditing() ).toBe( false );
				expect( registry.select( STORE_NAME ).getSettingsViewModuleState( 'test-module' ) ).toBe( 'closed' );
			} );

			it( 'returns "view" for the current module when not editing', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );
				expect( registry.select( STORE_NAME ).isSettingsViewEditing() ).toBe( false );

				expect( registry.select( STORE_NAME ).getSettingsViewModuleState( 'test-module' ) ).toBe( 'view' );
			} );

			it( 'returns "edit" for the current module when editing', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );
				registry.dispatch( STORE_NAME ).setSettingsViewIsEditing( true );

				expect( registry.select( STORE_NAME ).getSettingsViewModuleState( 'test-module' ) ).toBe( 'edit' );
			} );

			it( 'returns "locked" for any module other than the current when it is being edited', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );
				registry.dispatch( STORE_NAME ).setSettingsViewIsEditing( true );

				expect( registry.select( STORE_NAME ).getSettingsViewModuleState( 'other-module' ) ).toBe( 'locked' );
			} );
		} );

		describe( 'isSettingsViewEditing', () => {
			it( 'returns `false` when no module is being edited', () => {
				expect( registry.select( STORE_NAME ).isSettingsViewEditing() ).toBe( false );
			} );

			it( 'returns `true` if any module is being edited', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );
				registry.dispatch( STORE_NAME ).setSettingsViewIsEditing( true );

				expect( registry.select( STORE_NAME ).isSettingsViewEditing() ).toBe( true );
			} );
		} );

		describe( 'isSettingsViewModuleOpen', () => {
			it( 'returns `false` when there is no current module', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( '' );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleOpen( 'test-module' ) ).toBe( false );
			} );

			it( 'returns `false` when the given slug is not the current module', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'other-module' );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleOpen( 'test-module' ) ).toBe( false );
			} );

			it( 'returns `true` when the given slug is the current module', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleOpen( 'test-module' ) ).toBe( true );
			} );

			it( 'returns `true` when the given slug is the current module when editing', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );
				registry.dispatch( STORE_NAME ).setSettingsViewIsEditing( true );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleOpen( 'test-module' ) ).toBe( true );
			} );
		} );

		describe( 'isSettingsViewModuleEditing', () => {
			it( 'returns `false` when there is no current module', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( '' );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleEditing( 'test-module' ) ).toBe( false );
			} );

			it( 'returns `false` when the given slug is not the current module', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'other-module' );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleEditing( 'test-module' ) ).toBe( false );
			} );

			it( 'returns `false` when the given slug is the current module but not editing', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleEditing( 'test-module' ) ).toBe( false );
			} );

			it( 'returns `true` when the given slug is the current module and is editing', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );
				registry.dispatch( STORE_NAME ).setSettingsViewIsEditing( true );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleEditing( 'test-module' ) ).toBe( true );
			} );
		} );

		describe( 'isSettingsViewModuleLocked', () => {
			it( 'returns `false` when there is no current module', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( '' );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleLocked( 'test-module' ) ).toBe( false );
			} );

			it( 'returns `false` when the given slug is not the current module and it is not being edited', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'other-module' );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleLocked( 'test-module' ) ).toBe( false );
			} );

			it( 'returns `false` when the given slug is the current module but not editing', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleLocked( 'test-module' ) ).toBe( false );
			} );

			it( 'returns `false` when the given slug is the current module and is editing', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );
				registry.dispatch( STORE_NAME ).setSettingsViewIsEditing( true );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleLocked( 'test-module' ) ).toBe( false );
			} );

			it( 'returns `true` when the given slug is not the current module which is being edited', () => {
				registry.dispatch( STORE_NAME ).setSettingsViewCurrentModule( 'test-module' );
				registry.dispatch( STORE_NAME ).setSettingsViewIsEditing( true );

				expect( registry.select( STORE_NAME ).isSettingsViewModuleLocked( 'other-module' ) ).toBe( true );
			} );
		} );
	} );
} );
