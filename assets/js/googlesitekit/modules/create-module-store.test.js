/**
 * Module datastore functions tests.
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

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { createRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import {
	unsubscribeFromAll,
} from 'tests/js/utils';
import {
	createNotificationsStore,
} from 'assets/js/googlesitekit/data/create-notifications-store';
import { createModuleStore } from './create-module-store';

const STORE_NAME = 'modules/base';
const STORE_ARGS = [ 'base' ];

describe( 'createModuleStore store', () => {
	let apiFetchSpy;
	let registry;
	let storeDefinition;

	beforeAll( () => {
		API.setUsingCache( false );
	} );

	beforeEach( () => {
		registry = createRegistry();

		storeDefinition = createModuleStore( ...STORE_ARGS );
		registry.registerStore( STORE_NAME, storeDefinition );

		apiFetchSpy = jest.spyOn( { apiFetch }, 'apiFetch' );
	} );

	afterAll( () => {
		API.setUsingCache( true );
	} );

	afterEach( () => {
		unsubscribeFromAll( registry );
		apiFetchSpy.mockRestore();
	} );

	describe( 'actions', () => {
		it( 'includes all notifications store actions', () => {
			const notificationsStoreDefinition = createNotificationsStore( ...STORE_ARGS );

			expect( Object.keys( storeDefinition.actions ) ).toEqual(
				expect.arrayContaining( Object.keys( notificationsStoreDefinition.actions ) )
			);
		} );
	} );

	describe( 'selectors', () => {
		it( 'includes all notifications store selectors', () => {
			const notificationsStoreDefinition = createNotificationsStore( ...STORE_ARGS );

			expect( Object.keys( storeDefinition.selectors ) ).toEqual(
				expect.arrayContaining( Object.keys( notificationsStoreDefinition.selectors ) )
			);
		} );
	} );
} );
