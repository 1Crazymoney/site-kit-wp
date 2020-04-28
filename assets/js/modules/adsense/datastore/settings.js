/**
 * modules/adsense data store: settings.
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
import Data from 'googlesitekit-data';
import {
	isValidAccountID,
	isValidClientID,
} from '../util';
import { STORE_NAME } from './constants';

const { commonActions, createRegistrySelector, createRegistryControl } = Data;

// Actions
const SUBMIT_CHANGES = 'SUBMIT_CHANGES';
const START_SUBMIT_CHANGES = 'START_SUBMIT_CHANGES';
const FINISH_SUBMIT_CHANGES = 'FINISH_SUBMIT_CHANGES';

const FETCH_SAVE_USE_SNIPPET = 'FETCH_SAVE_USE_SNIPPET';
const START_FETCH_SAVE_USE_SNIPPET = 'START_FETCH_SAVE_USE_SNIPPET';
const FINISH_FETCH_SAVE_USE_SNIPPET = 'FINISH_FETCH_SAVE_USE_SNIPPET';
const CATCH_FETCH_SAVE_USE_SNIPPET = 'CATCH_FETCH_SAVE_USE_SNIPPET';

const RECEIVE_SAVE_USE_SNIPPET = 'RECEIVE_SAVE_USE_SNIPPET';

// The original account status on pageload is a specific requirement for
// certain parts of the AdSense setup flow.
const RECEIVE_ORIGINAL_ACCOUNT_STATUS = 'RECEIVE_ORIGINAL_ACCOUNT_STATUS';

export const INITIAL_STATE = {
	isDoingSubmitChanges: false,
	isFetchingSaveUseSnippet: false,
	originalAccountStatus: undefined,
};

export const actions = {
	*fetchSaveUseSnippet( useSnippet ) {
		let response, error;

		if ( 'undefined' === typeof useSnippet ) {
			error = {
				message: 'useSnippet is required.',
			};
			global.console.error( error.message );
			return { response, error };
		}

		yield {
			payload: {},
			type: START_FETCH_SAVE_USE_SNIPPET,
		};

		try {
			response = yield {
				payload: { useSnippet },
				type: FETCH_SAVE_USE_SNIPPET,
			};

			yield actions.receiveSaveUseSnippet( response, { useSnippet } );

			yield {
				payload: {},
				type: FINISH_FETCH_SAVE_USE_SNIPPET,
			};
		} catch ( e ) {
			error = e;
			yield {
				payload: { error },
				type: CATCH_FETCH_SAVE_USE_SNIPPET,
			};
		}

		return { response, error };
	},

	receiveSaveUseSnippet( response, params ) {
		invariant( response, 'response is required.' );
		invariant( params, 'params is required.' );

		return {
			payload: { response, params },
			type: RECEIVE_SAVE_USE_SNIPPET,
		};
	},

	/**
	 * Saves the current value of the 'useSnippet' setting.
	 *
	 * While the saveSettings action should typically be used for this, there
	 * is a use-case where the 'useSnippet' setting (and nothing else) needs to
	 * be saved right away when being toggled, which is what this action is
	 * intended for.
	 *
	 * @since n.e.x.t
	 */
	*saveUseSnippet() {
		const registry = yield commonActions.getRegistry();
		const useSnippet = registry.select( STORE_NAME ).getUseSnippet();
		if ( 'undefined' === typeof useSnippet ) {
			return;
		}

		yield actions.fetchSaveUseSnippet( useSnippet );
	},

	/**
	 * Submits all changes currently present in the client, persisting them on the server.
	 *
	 * @since n.e.x.t
	 */
	*submitChanges() {
		yield {
			payload: {},
			type: START_SUBMIT_CHANGES,
		};

		yield {
			payload: {},
			type: SUBMIT_CHANGES,
		};

		yield {
			payload: {},
			type: FINISH_SUBMIT_CHANGES,
		};
	},

	receiveOriginalAccountStatus( originalAccountStatus ) {
		invariant( originalAccountStatus, 'originalAccountStatus is required.' );

		return {
			payload: { originalAccountStatus },
			type: RECEIVE_ORIGINAL_ACCOUNT_STATUS,
		};
	},
};

export const controls = {
	[ FETCH_SAVE_USE_SNIPPET ]: ( { payload } ) => {
		const { useSnippet } = payload;
		return API.set( 'modules', 'adsense', 'use-snippet', { useSnippet } );
	},
	[ SUBMIT_CHANGES ]: createRegistryControl( ( registry ) => async () => {
		// This action shouldn't be called if settings haven't changed,
		// but this prevents errors in tests.
		if ( registry.select( STORE_NAME ).haveSettingsChanged() ) {
			const { error } = await registry.dispatch( STORE_NAME ).saveSettings();

			if ( error ) {
				return { error };
			}
		}

		await API.invalidateCache( 'modules', 'adsense' );
	} ),
};

export const reducer = ( state, { type, payload } ) => {
	switch ( type ) {
		case START_FETCH_SAVE_USE_SNIPPET: {
			return {
				...state,
				isFetchingSaveUseSnippet: true,
			};
		}

		case FINISH_FETCH_SAVE_USE_SNIPPET: {
			return {
				...state,
				isFetchingSaveUseSnippet: false,
			};
		}

		case RECEIVE_SAVE_USE_SNIPPET: {
			// The server response in this case is just a non-helpful true,
			// so this value is actually the one passed as parameter, assumed
			// to be the saved value from the successful request.
			const { params } = payload;
			const { useSnippet } = params;

			return {
				...state,
				// Update saved settings.
				savedSettings: {
					...( state.savedSettings || {} ),
					useSnippet,
				},
				// Also update client settings to ensure they're in sync.
				settings: {
					...( state.settings || {} ),
					useSnippet,
				},
			};
		}

		case CATCH_FETCH_SAVE_USE_SNIPPET: {
			const { error } = payload;

			return {
				...state,
				error,
				isFetchingSaveUseSnippet: false,
			};
		}

		case START_SUBMIT_CHANGES: {
			return {
				...state,
				isDoingSubmitChanges: true,
			};
		}

		case FINISH_SUBMIT_CHANGES: {
			return {
				...state,
				isDoingSubmitChanges: false,
			};
		}

		// This action is purely for testing, the value is typically handled
		// as a side-effect from 'RECEIVE_SETTINGS' (see below).
		case RECEIVE_ORIGINAL_ACCOUNT_STATUS: {
			const { originalAccountStatus } = payload;
			return {
				...state,
				originalAccountStatus,
			};
		}

		// This action is mainly handled via createSettingsStore, but here we
		// need it to have the side effect of storing the original account
		// status.
		case 'RECEIVE_SETTINGS': {
			const { values } = payload;
			const { accountStatus } = values;

			// Only set original account status when it is really the first
			// time that we load the settings on this pageload.
			if ( 'undefined' === typeof state.originalAccountStatus ) {
				return {
					...state,
					originalAccountStatus: accountStatus,
				};
			}

			return { ...state };
		}

		default: {
			return { ...state };
		}
	}
};

export const resolvers = {
	*getOriginalAccountStatus() {
		const registry = yield commonActions.getRegistry();

		// Do not do anything if original account status already known.
		const existingOriginalAccountStatus = registry.select( STORE_NAME ).getOriginalAccountStatus();
		if ( 'undefined' !== typeof existingOriginalAccountStatus ) {
			return;
		}

		// Ensure settings are being fetched if not yet in progress.
		registry.select( STORE_NAME ).getSettings();
	},
};

export const selectors = {
	/**
	 * Checks if changes can be submitted.
	 *
	 * @since n.e.x.t
	 *
	 * @return {boolean} True if changes can be submitted, false otherwise.
	 */
	canSubmitChanges: createRegistrySelector( ( select ) => () => {
		const {
			getAccountID,
			getClientID,
			haveSettingsChanged,
			isDoingSubmitChanges,
		} = select( STORE_NAME );

		if ( isDoingSubmitChanges() ) {
			return false;
		}
		if ( ! haveSettingsChanged() ) {
			return false;
		}
		if ( ! isValidAccountID( getAccountID() ) ) {
			return false;
		}
		if ( ! isValidClientID( getClientID() ) ) {
			return false;
		}

		return true;
	} ),

	isDoingSubmitChanges( state ) {
		return !! state.isDoingSubmitChanges;
	},

	isDoingSaveUseSnippet( state ) {
		return state.isFetchingSaveUseSnippet;
	},

	/**
	 * Gets the original account status stored before the current pageload.
	 *
	 * @since n.e.x.t
	 * @private
	 *
	 * @param {Object} state Data store's state.
	 * @return {?string} Original account status (may be an empty string), or
	 *                   undefined if not loaded yet.
	 */
	getOriginalAccountStatus( state ) {
		return state.originalAccountStatus;
	},
};

export default {
	INITIAL_STATE,
	actions,
	controls,
	reducer,
	resolvers,
	selectors,
};
