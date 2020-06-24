/**
 * createPreloadingMiddleware tests.
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
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import createPreloadingMiddleware from './preloading';

describe( 'Preloading Middleware', () => {
	it( 'should return cached data for the first request only.', async () => {
		const body = {
			status: 'this is the preloaded response',
		};

		const requestURI = 'google-site-kit/v1/core/user/authentication';

		const preloadedData = {
			[ requestURI ]: {
				method: 'GET',
				body,
			},
		};
		const preloadingMiddleware = createPreloadingMiddleware(
			preloadedData
		);

		const requestOptions = {
			method: 'GET',
			path: addQueryArgs( requestURI, { timestamp: Date.now() } ),
		};

		const firstRequest = await preloadingMiddleware( requestOptions, () => {} );
		expect( firstRequest ).toEqual( body );

		const secondRequest = await preloadingMiddleware( requestOptions, () => {} );
		expect( secondRequest ).toEqual( undefined );
	} );
} );
