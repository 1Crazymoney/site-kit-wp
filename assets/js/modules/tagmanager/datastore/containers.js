/**
 * modules/tagmanager data store: containers.
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
import { STORE_NAME } from './constants';
import { isValidAccountID, isValidUsageContext } from '../util/validation';
import { createFetchStore } from '../../../googlesitekit/data/create-fetch-store';

const fetchGetContainersStore = createFetchStore( {
	baseName: 'getContainers',
	argsToParams( accountID ) {
		invariant( isValidAccountID( accountID ), 'a valid accountID is required to fetch containers.' );

		return { accountID };
	},
	controlCallback: ( { accountID } ) => {
		return API.get( 'modules', 'tagmanager', 'containers', { accountID }, { useCache: false } );
	},
	reducerCallback( state, containers, { accountID } ) {
		return {
			...state,
			containers: {
				...state.containers,
				[ accountID ]: [ ...containers ],
			},
		};
	},
} );

const fetchCreateContainerStore = createFetchStore( {
	baseName: 'createContainer',
	argsToParams( accountID, usageContext ) {
		invariant( isValidAccountID( accountID ), 'a valid accountID is required to create a container.' );
		invariant( isValidUsageContext( usageContext ), 'a valid usageContext is required to create a container.' );

		return { accountID, usageContext };
	},
	controlCallback: ( { accountID, usageContext } ) => {
		return API.set( 'modules', 'tagmanager', 'create-container', { accountID, usageContext } );
	},
	reducerCallback( state, container, { accountID } ) {
		return {
			...state,
			containers: {
				...state.containers,
				[ accountID ]: [
					...( state.containers[ accountID ] || [] ),
					container,
				],
			},
		};
	},
} );

const BASE_INITIAL_STATE = {
	containers: {},
};

const baseActions = {
	createContainer: fetchCreateContainerStore.actions.fetchCreateContainer,
};

const baseResolvers = {
	*getContainers( accountID ) {
		const { select } = yield Data.commonActions.getRegistry();

		if ( ! select( STORE_NAME ).getContainers( accountID ) ) {
			yield fetchGetContainersStore.actions.fetchGetContainers( accountID );
		}
	},
};

const baseSelectors = {
	/**
	 * Gets the containers for a given account.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @param {string} accountID Account ID to get containers for.
	 * @param {string} [usageContext] Usage context of containers to filter by.
	 * @return {(Array|undefined)} Array of containers, or `undefined` if not loaded yet.
	 */
	getContainers( state, accountID, usageContext ) {
		const containers = state.containers[ accountID ];

		if ( containers && usageContext ) {
			return containers.filter( ( container ) => container.usageContext.includes( usageContext ) );
		}

		return containers;
	},
	/**
	 * Checks if any request for creating a container is in progress.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @return {boolean} True if a request for create-container is in progress, otherwise false.
	 */
	isDoingCreateContainer( state ) {
		return Object.values( state.isFetchingCreateContainer ).some( Boolean );
	},
};

const store = Data.combineStores(
	fetchGetContainersStore,
	fetchCreateContainerStore,
	{
		INITIAL_STATE: BASE_INITIAL_STATE,
		selectors: baseSelectors,
		resolvers: baseResolvers,
		actions: baseActions,
	}
);

export const {
	INITIAL_STATE,
	actions,
	controls,
	reducer,
	resolvers,
	selectors,
} = store;

export default store;
