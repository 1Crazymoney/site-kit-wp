/**
 * `withData` tests.
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
import { addAction, removeAllActions, removeAllFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import withData from './withdata';
import { render, act } from '../../../../tests/js/test-utils';
import dataAPI, { TYPE_MODULES } from '../data';
import { getCacheKey } from '../data/cache';

const collectModuleData = dataAPI.collectModuleData.bind( dataAPI );

describe( 'withData', () => {
	let TestComponent;
	const context = 'TestContext';
	// A dummy dateRange is used to allow for getting a stable cache key for the dataset.
	const dateRange = 'last-99-days';
	const loadingNode = <div data-testid="loading-component">loading</div>;
	const testModule = {
		slug: 'test',
		name: 'Test Module',
		active: true,
		setupComplete: true,
	};
	const testModuleAlt = {
		slug: 'test-alt',
		name: 'Alternate Test Module',
		active: true,
		setupComplete: true,
	};

	const createDataset = ( type, identifier, datapoint, data, _context = context ) => ( { type, identifier, datapoint, data, context: _context } );
	const getCacheKeyForDataset = ( { type, identifier, datapoint, data } ) => getCacheKey( type, identifier, datapoint, data );

	beforeEach( () => {
		TestComponent = jest.fn(
			() => <div data-testid="test-component">Test</div>
		);
		removeAllActions( 'googlesitekit.dataLoaded' );
		removeAllFilters( `googlesitekit.module${ context }DataRequest` );
	} );

	afterEach( () => {
		delete global._googlesitekitLegacyData.modules[ testModule.slug ];
		delete global._googlesitekitLegacyData.modules[ testModuleAlt.slug ];
	} );

	it( 'renders the loading when there is no data yet', () => {
		const WrappedComponent = withData( TestComponent, [], loadingNode );

		const { container, queryByTestID } = render( <WrappedComponent /> );

		expect( queryByTestID( 'test-component' ) ).not.toBeInTheDocument();
		expect( container.firstChild ).toBe( queryByTestID( 'loading-component' ) );
	} );

	it( 'renders the data dependent component when there is data', async () => {
		const [ type, identifier, datapoint, data ] = [ 'test', 'test-identifier', 'test-datapoint', { dateRange } ];
		const dataset = { type, identifier, datapoint, data, context };
		const WrappedComponent = withData( TestComponent, [ dataset ] );

		const { container, queryByTestID } = render( <WrappedComponent /> );

		const key = getCacheKeyForDataset( dataset );
		const responseData = { foo: 'bar' };

		fetchMock.postOnce(
			/^\/google-site-kit\/v1\/data/,
			{ body: { [ key ]: responseData } }
		);
		await act(
			() => new Promise( ( resolve ) => {
				addAction( 'googlesitekit.dataLoaded', 'test.resolve', resolve );
				collectModuleData( context );
			} )
		);

		expect( container.firstChild ).toBe( queryByTestID( 'test-component' ) );
		expect( queryByTestID( 'loading-component' ) ).not.toBeInTheDocument();
		expect( TestComponent.mock.calls[ 0 ][ 0 ].data ).toEqual( responseData );
		expect( TestComponent.mock.calls[ 0 ][ 0 ].datapoint ).toEqual( datapoint );
	} );

	it( 'renders the setup incomplete component when requesting data for a module with incomplete setup', () => {
		global._googlesitekitLegacyData.modules[ testModule.slug ] = { ...testModule, setupComplete: false };

		const [ type, identifier, datapoint, data ] = [ TYPE_MODULES, testModule.slug, 'test-datapoint', { dateRange } ];
		const dataset = { type, identifier, datapoint, data, context };
		const WrappedComponent = withData( TestComponent, [ dataset ] );

		const { container, queryByTestID } = render( <WrappedComponent /> );

		collectModuleData( context );

		expect( queryByTestID( 'test-component' ) ).not.toBeInTheDocument();
		expect( container.querySelector( '.googlesitekit-cta__title' ) ).toHaveTextContent( 'Test Module activation' );
		expect( container.querySelector( '.googlesitekit-cta__description' ) ).toHaveTextContent( 'Test Module module needs to be configured' );
		expect( fetchMock ).not.toHaveFetched();
	} );

	it( 'renders the setup incomplete component when requesting data from any module with incomplete setup', async () => {
		global._googlesitekitLegacyData.modules[ testModule.slug ] = { ...testModule, setupComplete: false };
		global._googlesitekitLegacyData.modules[ testModuleAlt.slug ] = testModuleAlt;

		const requests = [
			createDataset( TYPE_MODULES, testModule.slug, 'test-datapoint', { dateRange } ),
			createDataset( TYPE_MODULES, testModuleAlt.slug, 'test-datapoint', { dateRange } ),
		];
		const WrappedComponent = withData( TestComponent, requests, loadingNode );

		const { container, queryByTestID } = render( <WrappedComponent /> );

		// testModuleAlt's request will not be filtered out because its setup is complete.
		const testModuleAltCacheKey = getCacheKeyForDataset( requests[ 1 ] );
		const testModuleAltResponse = {
			[ testModuleAltCacheKey ]: { foo: 'bar' },
		};
		fetchMock.postOnce(
			/^\/google-site-kit\/v1\/data/,
			{ body: { [ testModuleAltCacheKey ]: testModuleAltResponse } }
		);
		await act(
			() => new Promise( ( resolve ) => {
				addAction( 'googlesitekit.dataLoaded', 'test.resolve', resolve );
				collectModuleData( context );
			} )
		);

		expect( queryByTestID( 'test-component' ) ).not.toBeInTheDocument();
		expect( container.querySelector( '.googlesitekit-cta__title' ) ).toHaveTextContent( 'Test Module activation' );
		expect( container.querySelector( '.googlesitekit-cta__description' ) ).toHaveTextContent( 'Test Module module needs to be configured' );
		expect( fetchMock ).toHaveFetched( /^\/google-site-kit\/v1\/data/ );
	} );
} );
