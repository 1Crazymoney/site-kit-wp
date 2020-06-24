/**
 * Tag Manager Module Component Stories.
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
import { storiesOf } from '@storybook/react';

/**
 * Internal dependencies
 */
import { WithTestRegistry } from '../tests/js/utils';
import { STORE_NAME } from '../assets/js/modules/tagmanager/datastore';
import { STORE_NAME as CORE_SITE, AMP_MODE_PRIMARY } from '../assets/js/googlesitekit/datastore/site/constants';
import * as fixtures from '../assets/js/modules/tagmanager/datastore/__fixtures__';
import AccountSelect from '../assets/js/modules/tagmanager/components/common/AccountSelect';
import WebContainerSelect from '../assets/js/modules/tagmanager/components/common/WebContainerSelect';
import AMPContainerSelect from '../assets/js/modules/tagmanager/components/common/AMPContainerSelect';
import UseSnippetSwitch from '../assets/js/modules/tagmanager/components/common/UseSnippetSwitch';
import ExistingTagNotice from '../assets/js/modules/tagmanager/components/common/ExistingTagNotice';
import ExistingTagError from '../assets/js/modules/tagmanager/components/common/ExistingTagError';
import ErrorNotice from '../assets/js/modules/tagmanager/components/common/ErrorNotice';
import AccountCreateLegacy from '../assets/js/modules/tagmanager/components/common/AccountCreateLegacy';

storiesOf( 'Tag Manager Module/Components', module )
	.add( 'AccountSelect', () => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).receiveGetAccounts( fixtures.accounts );
			registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
			registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<AccountSelect />
			</WithTestRegistry>
		);
	} )
	.add( 'WebContainerSelect', () => {
		const setupRegistry = ( registry ) => {
			const accountID = fixtures.getContainers.all[ 0 ].accountId;
			registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
			registry.dispatch( STORE_NAME ).receiveGetAccounts( [] );
			registry.dispatch( STORE_NAME ).setAccountID( accountID );
			registry.dispatch( STORE_NAME ).receiveGetContainers( fixtures.getContainers.all, { accountID } );
			registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
			registry.dispatch( CORE_SITE ).receiveSiteInfo( {} );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<WebContainerSelect />
			</WithTestRegistry>
		);
	} )
	.add( 'AMPContainerSelect', () => {
		const setupRegistry = ( registry ) => {
			const accountID = fixtures.getContainers.all[ 0 ].accountId;
			registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
			registry.dispatch( STORE_NAME ).receiveGetAccounts( [] );
			registry.dispatch( STORE_NAME ).setAccountID( accountID );
			registry.dispatch( STORE_NAME ).receiveGetContainers( fixtures.getContainers.all, { accountID } );
			registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
			registry.dispatch( CORE_SITE ).receiveSiteInfo( { ampMode: AMP_MODE_PRIMARY } );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<AMPContainerSelect />
			</WithTestRegistry>
		);
	} )
	.add( 'UseSnippetSwitch', () => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).setSettings( {} );
			registry.dispatch( STORE_NAME ).setUseSnippet( true );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<UseSnippetSwitch />
			</WithTestRegistry>
		);
	} )
	.add( 'ExistingTagNotice', () => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).receiveGetExistingTag( 'GTM-S1T3K1T' );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<ExistingTagNotice />
			</WithTestRegistry>
		);
	} )
	.add( 'ExistingTagError', () => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).receiveGetExistingTag( 'GTM-S1T3K1T' );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<ExistingTagError />
			</WithTestRegistry>
		);
	} )
	.add( 'ErrorNotice', () => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).receiveError( {
				code: 'KavHBokm704',
				message: 'They taste like burning!',
			} );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<ErrorNotice />
			</WithTestRegistry>
		);
	} )
	.add( 'AccountCreateLegacy', () => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).receiveGetAccounts( [] );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<AccountCreateLegacy />
			</WithTestRegistry>
		);
	} )
;
