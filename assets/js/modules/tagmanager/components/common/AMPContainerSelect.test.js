/**
 * Account Select component tests.
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
import AMPContainerSelect from './AMPContainerSelect';
import { fireEvent, render } from '../../../../../../tests/js/test-utils';
import { STORE_NAME, CONTEXT_WEB, CONTEXT_AMP, CONTAINER_CREATE } from '../../datastore/constants';
import { STORE_NAME as CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import { createTestRegistry } from '../../../../../../tests/js/utils';
import * as factories from '../../datastore/__factories__';

describe( 'AMPContainerSelect', () => {
	let registry;
	beforeEach( () => {
		registry = createTestRegistry();
		// Set settings to prevent fetch in resolver.
		registry.dispatch( STORE_NAME ).setSettings( {} );
		// Set set no existing tag.
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
		// Set site info to prevent error in resolver.
		registry.dispatch( CORE_SITE ).receiveSiteInfo( {} );
	} );
	afterEach( () => fetchMock.mockReset() );

	it( 'should render an option for each AMP container of the currently selected account.', () => {
		const account = factories.accountBuilder();
		const webContainers = factories.buildContainers(
			3, { accountId: account.accountId, usageContext: [ CONTEXT_WEB ] }
		);
		const ampContainers = factories.buildContainers(
			3, { accountId: account.accountId, usageContext: [ CONTEXT_AMP ] }
		);
		const accountID = account.accountId;
		registry.dispatch( STORE_NAME ).setAccountID( accountID );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( [ account ] );
		registry.dispatch( STORE_NAME ).receiveGetContainers( [ ...webContainers, ...ampContainers ], { accountID } );

		const { getAllByRole } = render( <AMPContainerSelect />, { registry } );

		const listItems = getAllByRole( 'menuitem', { hidden: true } );
		// Note: we do length + 1 here because there should also be an item for
		// "Set up a new container".
		expect( listItems ).toHaveLength( webContainers.length + 1 );
		expect(
			listItems.some( ( { dataset } ) => dataset.value === CONTAINER_CREATE )
		).toBe( true );
	} );

	it( 'should have a "Set up a new container" item at the end of the list', () => {
		const { account, containers } = factories.buildAccountWithContainers(
			{ container: { usageContext: [ CONTEXT_WEB ] } }
		);
		const accountID = account.accountId;
		registry.dispatch( STORE_NAME ).setAccountID( accountID );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( [ account ] );
		registry.dispatch( STORE_NAME ).receiveGetContainers( containers, { accountID } );

		const { getAllByRole } = render( <AMPContainerSelect />, { registry } );

		const listItems = getAllByRole( 'menuitem', { hidden: true } );
		expect( listItems.pop() ).toHaveTextContent( /set up a new container/i );
	} );

	it( 'should update the container ID and internal container ID when selected', () => {
		const { account, containers } = factories.buildAccountWithContainers(
			{ container: { usageContext: [ CONTEXT_AMP ] } }
		);
		const ampContainer = containers[ 0 ];
		const accountID = account.accountId;
		registry.dispatch( STORE_NAME ).setAccountID( accountID );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( [ account ] );
		registry.dispatch( STORE_NAME ).receiveGetContainers( containers, { accountID } );

		const { container, getByText } = render( <AMPContainerSelect />, { registry } );

		expect( registry.select( STORE_NAME ).getAMPContainerID() ).toBeFalsy();
		expect( registry.select( STORE_NAME ).getInternalAMPContainerID() ).toBeFalsy();

		fireEvent.click( container.querySelector( '.mdc-select__selected-text' ) );
		fireEvent.click( getByText( ampContainer.name ) );

		expect( registry.select( STORE_NAME ).getAMPContainerID() ).toBe( ampContainer.publicId );
		expect( registry.select( STORE_NAME ).getInternalAMPContainerID() ).toBe( ampContainer.containerId );
	} );

	it( 'should render a loading state while accounts have not been loaded', () => {
		fetchMock.getOnce(
			/^\/google-site-kit\/v1\/modules\/tagmanager\/data\/accounts/,
			new Promise( () => {} ) // Return a promise that never resolves to simulate an endless request.
		);

		const { queryAllByRole, queryByRole } = render( <AMPContainerSelect />, { registry } );

		expect( queryAllByRole( 'menuitem', { hidden: true } ) ).toHaveLength( 0 );

		expect( queryByRole( 'progressbar' ) ).toBeInTheDocument();
	} );

	it( 'should render a loading state while containers are loading', () => {
		fetchMock.get(
			/^\/google-site-kit\/v1\/modules\/tagmanager\/data\/containers/,
			new Promise( () => {} ) // Return a promise that never resolves to simulate an endless request.
		);
		const account = factories.accountBuilder();
		const accountID = account.accountId;
		registry.dispatch( STORE_NAME ).receiveGetAccounts( [ account ] );
		registry.dispatch( STORE_NAME ).setAccountID( accountID );

		const { queryAllByRole, queryByRole } = render( <AMPContainerSelect />, { registry } );

		expect( queryAllByRole( 'menuitem', { hidden: true } ) ).toHaveLength( 0 );

		expect( queryByRole( 'progressbar' ) ).toBeInTheDocument();
	} );
} );
