/**
 * Analytics module utility functions.
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
import * as fixtures from '../../assets/js/modules/analytics/datastore/__fixtures__';
import { STORE_NAME } from '../../assets/js/modules/analytics/datastore/constants';
import { STORE_NAME as CORE_SITE, AMP_MODE_SECONDARY } from '../../assets/js/googlesitekit/datastore/site/constants';
import { STORE_NAME as CORE_MODULES } from '../../assets/js/googlesitekit/modules/datastore/constants';
import { createBuildAndReceivers } from '../../assets/js/modules/tagmanager/datastore/__factories__/utils';

/**
 * Generates a story for a case when a GTM with Analytics property ID is already connected.
 *
 * @since n.e.x.t
 *
 * @param {Object}      args                Story arguments.
 * @param {WPComponent} args.Component      Story component.
 * @param {boolean}     args.useExistingTag Whether to use an existing tag or not.
 * @param {boolean}     args.gaPermission   Whether the current user has GA tag permissions.
 * @param {boolean}     args.gtmPermission  Whether the current user has GTM tag permissions.
 * @return {Function} Story callback function.
 */
export function generateGtmPropertyStory( {
	Component,
	useExistingTag = false,
	gaPermission = false,
	gtmPermission = false,
} ) {
	return () => {
		const setupRegistry = ( registry ) => {
			const existingTagAccountID = '151753095';
			const existingTagPropertyID = 'UA-151753095-1';
			const existingTagWebPropertyID = '216084975';

			const gtmAccountID = '152925174';
			const gtmPropertyID = 'UA-152925174-1';

			const properties = [
				...fixtures.accountsPropertiesProfiles.properties,
				{
					accountId: existingTagAccountID,
					defaultProfileId: '206512257',
					id: existingTagPropertyID,
					internalWebPropertyId: existingTagWebPropertyID,
					name: 'qwerty',
				},
			];

			const profiles = [
				...fixtures.accountsPropertiesProfiles.profiles,
				{
					accountId: existingTagAccountID,
					id: '206512258',
					internalWebPropertyId: existingTagWebPropertyID,
					name: 'All Web Site Data',
					webPropertyId: existingTagPropertyID,
				},
			];

			registry.dispatch( CORE_MODULES ).receiveGetModules( [
				{
					slug: 'tagmanager',
					name: 'Tag Manager',
					description: 'Tag Manager creates an easy to manage way to create tags on your site without updating code.',
					homepage: 'https://tagmanager.google.com/',
					internal: false,
					active: true,
					connected: true,
					dependencies: [ 'analytics' ],
					dependants: [],
					order: 10,
				},
			] );

			registry.dispatch( CORE_SITE ).receiveSiteInfo( {
				homeURL: 'https://example.com/',
				ampMode: AMP_MODE_SECONDARY,
			} );

			registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
			registry.dispatch( STORE_NAME ).receiveGetAccounts( fixtures.accountsPropertiesProfiles.accounts );

			[ gtmAccountID, existingTagAccountID ].forEach( ( accountID ) => {
				const accountProperties = properties.filter( ( { accountId } ) => accountId === accountID );

				registry.dispatch( STORE_NAME ).receiveGetProperties(
					accountProperties,
					{ accountID },
				);

				accountProperties.forEach( ( { id: propertyID } ) => {
					registry.dispatch( STORE_NAME ).receiveGetProfiles(
						profiles.filter( ( { webPropertyId } ) => webPropertyId === propertyID ),
						{ accountID, propertyID }
					);
				} );
			} );

			if ( useExistingTag ) {
				registry.dispatch( STORE_NAME ).receiveGetExistingTag( existingTagPropertyID );
				registry.dispatch( STORE_NAME ).receiveGetTagPermission( {
					accountID: existingTagAccountID,
					permission: gaPermission,
				}, { propertyID: existingTagPropertyID } );
			} else {
				registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
			}

			registry.dispatch( STORE_NAME ).receiveGetTagPermission( {
				accountID: gtmAccountID,
				permission: gtmPermission,
			}, { propertyID: gtmPropertyID } );

			const { buildAndReceiveWebAndAMP } = createBuildAndReceivers( registry );
			buildAndReceiveWebAndAMP( {
				accountID: gtmAccountID,
				webPropertyID: gtmPropertyID,
				ampPropertyID: gtmPropertyID,
			} );
		};

		return <Component callback={ setupRegistry } />;
	};
}
