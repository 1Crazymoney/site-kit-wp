/**
 * modules/analytics data store: tags.
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
import { getExistingTag } from 'assets/js/util';
import { STORE_NAME } from './index';

// Actions
const FETCH_EXISTING_TAG = 'FETCH_EXISTING_TAG';
const FETCH_TAG_PERMISSION = 'FETCH_TAG_PERMISSION';
const RECEIVE_EXISTING_TAG = 'RECEIVE_EXISTING_TAG';
const RECEIVE_EXISTING_TAG_FAILED = 'RECEIVE_EXISTING_TAG_FAILED';
const RECEIVE_TAG_PERMISSION = 'RECEIVE_TAG_PERMISSION';
const RECEIVE_TAG_PERMISSION_FAILED = 'RECEIVE_TAG_PERMISSION_FAILED';

export const INITIAL_STATE = {
	existingTag: undefined,
	isFetchingExistingTag: false,
	isFetchingTagPermission: {},
	tagPermissions: {},
};

export const actions = {
	*fetchExistingTag() {
		return {
			payload: {},
			type: FETCH_EXISTING_TAG,
		};
	},

	*fetchTagPermission( { accountId, propertyId, tag } ) {
		invariant( accountId, 'accountId is required.' );
		invariant( propertyId, 'propertyId is required.' );
		invariant( tag, 'tag is required.' );

		return {
			payload: { accountId, propertyId, tag },
			type: FETCH_TAG_PERMISSION,
		};
	},

	receiveExistingTag( existingTag ) {
		invariant( existingTag, 'existingTag is required.' );

		return {
			payload: { existingTag },
			type: RECEIVE_EXISTING_TAG,
		};
	},

	receiveExistingTagFailed( error ) {
		invariant( error, 'error is required.' );

		return {
			payload: { error },
			type: RECEIVE_EXISTING_TAG_FAILED,
		};
	},

	receiveTagPermission( { accountId, propertyId, permission, tag } ) {
		invariant( accountId, 'accountId is required.' );
		invariant( permission !== undefined, 'permission cannot be undefined.' );
		invariant( propertyId, 'propertyId is required.' );
		invariant( tag, 'tag is required.' );

		return {
			payload: { accountId, propertyId, permission, tag },
			type: RECEIVE_TAG_PERMISSION,
		};
	},

	receiveTagPermissionFailed( { accountId, error, propertyId, tag } ) {
		invariant( accountId, 'accountId is required.' );
		invariant( error, 'error is required.' );
		invariant( propertyId, 'propertyId is required.' );
		invariant( tag, 'tag is required.' );

		return {
			payload: { accountId, error, propertyId, tag },
			type: RECEIVE_TAG_PERMISSION_FAILED,
		};
	},
};

export const controls = {
	[ FETCH_EXISTING_TAG ]: () => {
		// TODO: Replace this with data from `core/site` selectors and
		// an implementation contained inside the store
		// once https://github.com/google/site-kit-wp/issues/1000 is
		// implemented.
		// TODO: Test this in the future. The underlying implementation is
		// currently quite nested and difficult to straightforwardly test.
		return getExistingTag( 'analytics' );
	},
	[ FETCH_TAG_PERMISSION ]: ( { payload: { tag } } ) => {
		return API.get( 'modules', 'analytics', 'tag-permission', { tag } );
	},
};

export const reducer = ( state, action ) => {
	switch ( action.type ) {
		case FETCH_EXISTING_TAG: {
			return {
				...state,
				isFetchingExistingTag: true,
			};
		}

		case FETCH_TAG_PERMISSION: {
			const { tag } = action.payload;

			return {
				...state,
				isFetchingTagPermission: {
					...state.isFetchingTagPermission,
					[ tag ]: true,
				},
			};
		}

		case RECEIVE_EXISTING_TAG: {
			const { existingTag } = action.payload;

			return {
				...state,
				existingTag,
				isFetchingExistingTag: false,
			};
		}

		case RECEIVE_EXISTING_TAG_FAILED: {
			const { error } = action.payload;

			return {
				...state,
				error,
				isFetchingExistingTag: false,
			};
		}

		case RECEIVE_TAG_PERMISSION: {
			const { accountId, propertyId, permission, tag } = action.payload;

			return {
				...state,
				isFetchingTagPermission: {
					...state.isFetchingTagPermission,
					[ tag ]: false,
				},
				tagPermissions: {
					...state.tagPermissions,
					[ accountId ]: {
						...state.tagPermissions[ accountId ] || {},
						[ propertyId ]: permission,
					},
				},
			};
		}

		case RECEIVE_TAG_PERMISSION_FAILED: {
			const { error, tag } = action.payload;

			return {
				...state,
				error,
				isFetchingTagPermission: {
					...state.isFetchingTagPermission,
					[ tag ]: false,
				},
			};
		}

		default: {
			return { ...state };
		}
	}
};

export const resolvers = {
	*getExistingTag() {
		try {
			const existingTag = yield actions.fetchExistingTag( 'analytics' );
			yield actions.receiveExistingTag( existingTag );

			// Invalidate this resolver so it will run again.
			yield Data.stores[ STORE_NAME ].getActions().invalidateResolutionForStoreSelector( 'getExistingTag' );

			return;
		} catch ( err ) {
			// TODO: Implement an error handler store or some kind of centralized
			// place for error dispatch...
			return actions.receiveExistingTagFailed( err );
		}
	},

	*getTagPermission( accountId, propertyId, tag ) {
		try {
			const response = yield actions.fetchTagPermission( { accountId, propertyId, tag } );

			const permission = (
				accountId === response.accountID &&
				propertyId === response.propertyID
			);

			yield actions.receiveTagPermission( { accountId, propertyId, permission, tag } );

			return;
		} catch ( error ) {
			// This error code indicates the current user doesn't have access to this
			// tag and shouldn't dispatch an error action.
			if ( error.code === 'google_analytics_existing_tag_permission' ) {
				yield actions.receiveTagPermission( { accountId, propertyId, permission: false, tag } );
				return;
			}

			// TODO: Implement an error handler store or some kind of centralized
			// place for error dispatch...
			return actions.receiveTagPermissionFailed( { accountId, error, propertyId, tag } );
		}
	},
};

export const selectors = {
	/**
	 * Check to see if an existing tag is available on the site.
	 *
	 * @since n.e.x.t
	 *
	 * @return {boolean|undefined} `true` is a tag exists, `false` if not; `undefined` if not loaded.
	 */
	hasExistingTag() {
		const existingTag = Data.select( STORE_NAME ).getExistingTag();
		return existingTag !== undefined ? !! existingTag : undefined;
	},

	/**
	 * Get an existing tag on the site, if present.
	 *
	 * Returns an object with the shape when successful:
	 * ```
	 * {
	 *   accountID = null,
	 *   propertyID = null,
	 * }
	 * ```
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @return {Object|undefined} Site connection info.
	 */
	getExistingTag( state ) {
		const { existingTag } = state;

		return existingTag;
	},

	/**
	 * Check permissions for an existing Google Analytics tag.
	 *
	 * Get permissions for a tag based on a Google Analytics `accountId` and
	 * `propertyId`. Useful when an existing tag on the site is found and
	 * you want to verify that an account + property combination has access to
	 * said tag.
	 *
	 * Returns `undefined` if the permission check has not yet loaded.
	 *
	 * @since n.e.x.t
	 * @param {Object} state Data store's state.
	 * @param {string} accountId The Analytics Account ID to fetch permissions for.
	 * @param {string} propertyId The Analytics Property ID to check permissions for.
	 * @param {string} tag The Google Analytics tag identifier to check.
	 * @return {boolean|undefined} `true` if account + property has permission to access the tag, `false` if not; `undefined` if not loaded.
	 */
	getTagPermission( state, accountId, propertyId, tag ) {
		invariant( accountId, 'accountId is required.' );
		invariant( propertyId, 'propertyId is required.' );
		invariant( tag, 'tag is required.' );

		const { tagPermissions } = state;

		if (
			tagPermissions &&
			tagPermissions[ accountId ] &&
			tagPermissions[ accountId ][ propertyId ] !== undefined
		) {
			return tagPermissions[ accountId ][ propertyId ];
		}

		return undefined;
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
