/**
 * modules/analytics data store: properties.
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
import { STORE_NAME } from './index';

// Actions
const FETCH_CREATE_PROPERTY = 'FETCH_CREATE_PROPERTY';
const FETCH_PROPERTIES_PROFILES = 'FETCH_PROPERTIES_PROFILES';
const RECEIVE_CREATE_PROPERTY = 'RECEIVE_CREATE_PROPERTY';
const RECEIVE_CREATE_PROPERTY_FAILED = 'RECEIVE_CREATE_PROPERTY_FAILED';
const RECEIVE_PROPERTIES_PROFILES = 'RECEIVE_PROPERTIES_PROFILES';
const RECEIVE_PROPERTIES_PROFILES_FAILED = 'RECEIVE_PROPERTIES_PROFILES_FAILED';

export const INITIAL_STATE = {
	isDoingCreateProperty: {},
	isFetchingPropertiesProfiles: {},
	properties: undefined,
};

export const actions = {
	/**
	 * Creates a new Analytics property.
	 *
	 * Creates a new Analytics property for an existing Google Analytics account.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} accountID Google Analytics account ID.
	 * @return {Object} Redux-style action.
	 */
	*createProperty( accountID ) {
		invariant( accountID, 'accountID is required.' );

		try {
			const property = yield actions.fetchCreateProperty( accountID );

			yield actions.receiveCreateProperty( { accountID, property } );
			yield Data.dispatch( STORE_NAME ).setPropertyID( property.id );
			return;
		} catch ( error ) {
			// TODO: Implement an error handler store or some kind of centralized
			// place for error dispatch...
			return actions.receiveCreatePropertyFailed( { accountID, error } );
		}
	},

	*fetchCreateProperty( accountID ) {
		invariant( accountID, 'accountID is required.' );

		return {
			payload: { accountID },
			type: FETCH_CREATE_PROPERTY,
		};
	},

	*fetchPropertiesProfiles( accountID ) {
		invariant( accountID, 'accountID is required.' );

		return {
			payload: { accountID },
			type: FETCH_PROPERTIES_PROFILES,
		};
	},

	/**
	 * Adds a property to the data store.
	 *
	 * Adds the newly-created property to the existing properties in
	 * the data store.
	 *
	 * @since n.e.x.t
	 * @private
	 *
	 * @param {Object} args Argument params.
	 * @param {string} args.accountID Google Analytics account ID.
	 * @param {Object} args.property Google Analytics property object.
	 * @return {Object} Redux-style action.
	 */
	receiveCreateProperty( { accountID, property } ) {
		invariant( accountID, 'accountID is required' );
		invariant( property, 'property is required' );

		return {
			payload: { accountID, property },
			type: RECEIVE_CREATE_PROPERTY,
		};
	},

	/**
	 * Logs an error with property creation.
	 *
	 * @since n.e.x.t
	 * @private
	 *
	 * @param {Object} args Argument params.
	 * @param {string} args.accountID Google Analytics account ID.
	 * @param {Object} args.error Error object.
	 * @return {Object} Redux-style action.
	 */
	receiveCreatePropertyFailed( { accountID, error } ) {
		invariant( accountID, 'accountID is required' );
		invariant( error, 'error is required.' );

		return {
			payload: { accountID, error },
			type: RECEIVE_CREATE_PROPERTY_FAILED,
		};
	},

	receivePropertiesProfiles( { accountID, properties, profiles } ) {
		invariant( accountID, 'accountID is required' );
		invariant( properties, 'properties is required' );

		return {
			payload: { accountID, properties, profiles },
			type: RECEIVE_PROPERTIES_PROFILES,
		};
	},

	receivePropertiesProfilesFailed( { accountID, error } ) {
		invariant( accountID, 'accountID is required' );
		invariant( error, 'error is required.' );

		return {
			payload: { accountID, error },
			type: RECEIVE_PROPERTIES_PROFILES_FAILED,
		};
	},
};

export const controls = {
	[ FETCH_CREATE_PROPERTY ]: ( { payload: { accountID } } ) => {
		return API.set( 'modules', 'analytics', 'create-property', { accountID } );
	},
	[ FETCH_PROPERTIES_PROFILES ]: ( { payload: { accountID } } ) => {
		return API.get( 'modules', 'analytics', 'properties-profiles', { accountID } );
	},
};

export const reducer = ( state, { type, payload } ) => {
	switch ( type ) {
		case FETCH_CREATE_PROPERTY: {
			const { accountID } = payload;

			return {
				...state,
				isDoingCreateProperty: {
					...state.isDoingCreateProperty,
					[ accountID ]: true,
				},
			};
		}

		case FETCH_PROPERTIES_PROFILES: {
			const { accountID } = payload;

			return {
				...state,
				isFetchingPropertiesProfiles: {
					...state.isFetchingPropertiesProfiles,
					[ accountID ]: true,
				},
			};
		}

		case RECEIVE_CREATE_PROPERTY: {
			const { accountID, property } = payload;

			return {
				...state,
				isDoingCreateProperty: {
					...state.isDoingCreateProperty,
					[ accountID ]: false,
				},
				properties: {
					...state.properties || {},
					[ accountID ]: [
						...( state.properties || {} )[ accountID ] || [],
						property,
					],
				},
			};
		}

		case RECEIVE_CREATE_PROPERTY_FAILED: {
			const { accountID, error } = payload;

			return {
				...state,
				error,
				isDoingCreateProperty: {
					...state.isDoingCreateProperty,
					[ accountID ]: false,
				},
			};
		}

		case RECEIVE_PROPERTIES_PROFILES: {
			const { accountID, properties, profiles } = payload;

			const updatedState = {
				...state,
				isFetchingPropertiesProfiles: {
					...state.isFetchingPropertiesProfiles,
					[ accountID ]: false,
				},
				properties: {
					...state.properties || {},
					[ accountID ]: properties,
				},
			};

			// If profiles are returned, determine their property ID.
			if ( profiles.length ) {
				updatedState.profiles = {
					...state.profiles || {},
					[ `${ accountID }::${ profiles[ 0 ].webPropertyId }` ]: profiles, // Capitalization rule exception: `webPropertyId` is a property of an API returned value.
				};
			}

			return updatedState;
		}

		case RECEIVE_PROPERTIES_PROFILES_FAILED: {
			const { accountID, error } = payload;

			return {
				...state,
				error,
				isFetchingPropertiesProfiles: {
					...state.isFetchingPropertiesProfiles,
					[ accountID ]: false,
				},
			};
		}

		default: {
			return { ...state };
		}
	}
};

export const resolvers = {
	*getProperties( accountID ) {
		try {
			const response = yield actions.fetchPropertiesProfiles( accountID );
			const { properties, profiles } = response;

			yield actions.receivePropertiesProfiles( { accountID, properties, profiles } );

			return;
		} catch ( error ) {
			// TODO: Implement an error handler store or some kind of centralized
			// place for error dispatch...
			return actions.receivePropertiesProfilesFailed( { accountID, error } );
		}
	},
};

export const selectors = {
	/**
	 * Get all Google Analytics properties this account can access.
	 *
	 * Returns an array of all analytics properties.
	 *
	 * Returns `undefined` if accounts have not yet loaded.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @param {string} accountID The Analytics Account ID to fetch properties for.
	 * @return {Array|undefined} An array of Analytics properties; `undefined` if not loaded.
	 */
	getProperties( state, accountID ) {
		invariant( accountID, 'accountID is required' );

		const { properties } = state;

		if ( 'undefined' === typeof properties || 'undefined' === typeof properties[ accountID ] ) {
			return undefined;
		}

		return properties[ accountID ];
	},

	/**
	 * Check if a property is being created for an account.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @param {string} accountID The Analytics Account ID to check for property creation.
	 * @return {boolean} `true` if creating a property, `false` if not.
	 */
	isDoingCreateProperty( state, accountID ) {
		invariant( accountID, 'accountID is required' );

		const { isDoingCreateProperty } = state;

		return !! isDoingCreateProperty[ accountID ];
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
