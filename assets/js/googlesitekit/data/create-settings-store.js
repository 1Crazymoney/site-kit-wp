/**
 * Provides API functions to create a datastore for settings.
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
import invariant from 'invariant';

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';

// Actions
const SET_SETTINGS = 'SET_SETTINGS';
const FETCH_SETTINGS = 'FETCH_SETTINGS';
const RECEIVE_SETTINGS = 'RECEIVE_SETTINGS';
const RECEIVE_SETTINGS_FAILED = 'RECEIVE_SETTINGS_FAILED';
const FETCH_SAVE_SETTINGS = 'FETCH_SAVE_SETTINGS';
const RECEIVE_SAVE_SETTINGS = 'RECEIVE_SAVE_SETTINGS';
const RECEIVE_SAVE_SETTINGS_FAILED = 'RECEIVE_SAVE_SETTINGS_FAILED';

/**
 * Creates a store object that includes actions and selectors for managing settings.
 *
 * The first three parameters hook up the store to the respective REST API endpoint,
 * while the fourth defines the names of the sub-settings to support.
 *
 * @since n.e.x.t
 * @private
 * @param {string} type        The data to access. One of 'core' or 'modules'.
 * @param {string} identifier  The data identifier, eg. a module slug like 'search-console'.
 * @param {string} datapoint   The endpoint to request data from, e.g. 'settings'.
 * @param {Array}  subSettings List of the slugs that are part of the settings object handled
 *                             by the respective API endpoint.
 * @return {Object} The settings store object.
 */
export const createSettingsStore = ( type, identifier, datapoint, subSettings ) => {
	const INITIAL_STATE = {
		settings: {},
		savedSettings: undefined,
		isFetchingSettings: false,
		isFetchingSaveSettings: false,
	};

	// This will be populated further down with sub-setting-specific reducer functions.
	const subSettingReducers = {};

	const actions = {
		/**
		 * Sets settings for the given values.
		 *
		 * @since n.e.x.t
		 *
		 * @param {Object} values Settings with their values to set.
		 * @return {Object} Redux-style action.
		 */
		setSettings( values ) {
			invariant( values, 'values is required.' );

			return {
				payload: { values },
				type: SET_SETTINGS,
			};
		},

		/**
		 * Dispatches an action that creates an HTTP request to the settings endpoint.
		 *
		 * @since n.e.x.t
		 * @private
		 *
		 * @return {Object} Redux-style action.
		 */
		fetchSettings() {
			return {
				payload: {},
				type: FETCH_SETTINGS,
			};
		},

		/**
		 * Stores settings received from the REST API.
		 *
		 * @since n.e.x.t
		 * @private
		 *
		 * @param {Array} values Settings with their values from the API.
		 * @return {Object} Redux-style action.
		 */
		receiveSettings( values ) {
			invariant( values, 'values is required.' );

			return {
				payload: { values },
				type: RECEIVE_SETTINGS,
			};
		},

		/**
		 * Dispatches an action signifying the `fetchSettings` side-effect failed.
		 *
		 * @since n.e.x.t
		 * @private
		 *
		 * @return {Object} Redux-style action.
		 */
		receiveSettingsFailed() {
			return {
				payload: {},
				type: RECEIVE_SETTINGS_FAILED,
			};
		},

		/**
		 * Saves all current settings to the server.
		 *
		 * @since n.e.x.t
		 *
		 * @return {Object} Redux-style action.
		 */
		*saveSettings() {
			try {
				const values = yield actions.fetchSaveSettings();
				return actions.receiveSaveSettings( values );
			} catch ( err ) {
				// TODO: Implement an error handler store or some kind of centralized
				// place for error dispatch...
				return actions.receiveResetFailed();
			}
		},

		/**
		 * Dispatches an action that creates an HTTP request to save settings.
		 *
		 * @since n.e.x.t
		 * @private
		 *
		 * @return {Object} Redux-style action.
		 */
		fetchSaveSettings() {
			return {
				payload: {},
				type: FETCH_SAVE_SETTINGS,
			};
		},

		/**
		 * Dispatches that settings were saved via the REST API.
		 *
		 * @since n.e.x.t
		 * @private
		 *
		 * @param {Array} values Settings with their values from the API.
		 * @return {Object} Redux-style action.
		 */
		receiveSaveSettings( values ) {
			invariant( values, 'values is required.' );

			return {
				payload: {},
				type: RECEIVE_SAVE_SETTINGS,
			};
		},

		/**
		 * Dispatches an action signifying the `fetchSaveSettings` side-effect failed.
		 *
		 * @since n.e.x.t
		 * @private
		 *
		 * @return {Object} Redux-style action.
		 */
		receiveSaveSettingsFailed() {
			return {
				payload: {},
				type: RECEIVE_SAVE_SETTINGS_FAILED,
			};
		},
	};

	const controls = {
		[ FETCH_SETTINGS ]: () => {
			return API.get( type, identifier, datapoint );
		},
		[ FETCH_SAVE_SETTINGS ]: () => {
			return API.set( type, identifier, datapoint );
		},
	};

	const reducer = ( state = INITIAL_STATE, action ) => {
		switch ( action.type ) {
			case SET_SETTINGS: {
				const { values } = action.payload;

				return {
					...state,
					settings: {
						...state.settings,
						...values,
					},
				};
			}

			case FETCH_SETTINGS: {
				return {
					...state,
					isFetchingSettings: true,
				};
			}

			case RECEIVE_SETTINGS: {
				const { values } = action.payload;

				return {
					...state,
					isFetchingSettings: false,
					savedSettings: {
						...values,
					},
					settings: {
						...values,
					},
				};
			}

			case RECEIVE_SETTINGS_FAILED: {
				return {
					...state,
					isFetchingSettings: false,
				};
			}

			case FETCH_SAVE_SETTINGS: {
				return {
					...state,
					isFetchingSaveSettings: true,
				};
			}

			case RECEIVE_SAVE_SETTINGS: {
				const { values } = action.payload;

				return {
					...state,
					isFetchingSaveSettings: false,
					savedSettings: {
						...values,
					},
					settings: {
						...values,
					},
				};
			}

			case RECEIVE_SAVE_SETTINGS_FAILED: {
				return {
					...state,
					isFetchingSaveSettings: false,
				};
			}

			default: {
				// Check if this action is for a sub-setting reducer.
				if ( 'undefined' !== typeof subSettingReducers[ action.type ] ) {
					return subSettingReducers[ action.type ]( state, action );
				}

				return { ...state };
			}
		}
	};

	const resolvers = {
		*getSettings() {
			try {
				const values = yield actions.fetchSettings();
				return actions.receiveSettings( values );
			} catch ( err ) {
				return actions.receiveSettingsFailed();
			}
		},
	};

	const selectors = {
		/**
		 * Gets the current settings.
		 *
		 * Returns `undefined` if notifications are not available/loaded.
		 *
		 * @since n.e.x.t
		 *
		 * @param {Object} state Data store's state.
		 * @return {Object|undefined} Settings with their values, or undefined.
		 */
		getSettings( state ) {
			return state.settings;
		},

		/**
		 * Indicates whether the current settings have changed from what is saved.
		 *
		 * @since n.e.x.t
		 *
		 * @param {Object} state Data store's state.
		 * @return {boolean} True if the settings have changed, false otherwise.
		 */
		haveSettingsChanged( state ) {
			const { settings, savedSettings } = state;

			return settings !== savedSettings;
		},

		/**
		 * Indicates whether saving the settings is currently in progress.
		 *
		 * @since n.e.x.t
		 *
		 * @param {Object} state Data store's state.
		 * @return {boolean} True if the settings are being saved, false otherwise.
		 */
		isDoingSaveSettings( state ) {
			return state.isFetchingSaveSettings;
		},
	};

	// Define individual actions, selectors and related for sub-settings.
	subSettings.forEach( ( setting ) => {
		const pascalCaseSetting = setting.charAt( 0 ).toUpperCase() + setting.slice( 1 );
		const constantSetting = setting.replace( /([a-z0-9]{1})([A-Z]{1})/g, '$1_$2' ).toUpperCase();

		actions[ `set${ pascalCaseSetting }` ] = ( value ) => {
			invariant( value, 'value is required.' );

			return {
				payload: { value },
				type: `SET_${ constantSetting }`,
			};
		};

		subSettingReducers[ `SET_${ constantSetting }` ] = ( state, action ) => {
			const { value } = action.payload;

			return {
				...state,
				settings: {
					...state.settings,
					[ setting ]: value,
				},
			};
		};

		resolvers[ `get${ pascalCaseSetting }` ] = resolvers.getSettings;

		selectors[ `get${ pascalCaseSetting }` ] = ( state ) => {
			const { settings } = state;

			if ( 'undefined' === typeof settings ) {
				return settings;
			}

			return settings[ setting ];
		};
	} );

	return {
		INITIAL_STATE,
		actions,
		controls,
		reducer,
		resolvers,
		selectors,
	};
};
