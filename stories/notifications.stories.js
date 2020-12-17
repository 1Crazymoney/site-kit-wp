/**
 * Notification Component Stories.
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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { provideModuleRegistrations, provideSiteInfo, provideModules, WithTestRegistry } from '../tests/js/utils';
import UserInputSuccessNotification from '../assets/js/components/notifications/UserInputSuccessNotification';
import ModulesList from '../assets/js/components/ModulesList';
import Notification from '../assets/js/components/legacy-notifications/notification';
import UserInputSettings from '../assets/js/components/notifications/UserInputSettings';
import { STORE_NAME as CORE_USER } from '../assets/js/googlesitekit/datastore/user/constants';
import { STORE_NAME as MODULES_ADSENSE } from '../assets/js/modules/adsense/datastore/constants';
import gWinImage from '../assets/images/g-win.png';
import rocketImage from '../assets/images/rocket.png';
import sunImage from '../assets/images/sun.png';
import sunSmallImage from '../assets/images/sun-small.png';
import thumbsUpImage from '../assets/images/thumbs-up.png';

global._googlesitekitLegacyData.canAdsRun = true;

storiesOf( 'Global/Notifications', module )
	.add( 'Module Setup Complete', () => {
		const setupRegistry = ( registry ) => {
			provideModules( registry );
			provideModuleRegistrations( registry );
			registry.dispatch( MODULES_ADSENSE ).receiveIsAdBlockerActive( false );
		};

		return (
			<WithTestRegistry callback={ setupRegistry } >
				<Notification
					id="notification-id"
					title={ __( 'Congrats on completing the setup for Analytics!', 'google-site-kit' ) }
					winImage={ rocketImage }
					dismiss={ __( 'OK, Got it!', 'google-site-kit' ) }
					format="large"
					type="win-success"
				>
					<ModulesList
						moduleSlugs={ [ 'search-console', 'adsense', 'analytics', 'pagespeed-insights' ] }
					/>
				</Notification>
			</WithTestRegistry>
		);
	} )
	.add( 'Small with Image', () => (
		<Notification
			id="notification-id"
			title={ __( 'Congrats on your first post!', 'google-site-kit' ) }
			description={ __( 'We sent your sitemap to Googlebot.', 'google-site-kit' ) }
			learnMore={ __( 'Learn more', 'google-site-kit' ) }
			dismiss={ __( 'OK, Got it!', 'google-site-kit' ) }
			format="small"
			smallImage={ thumbsUpImage }
			type="win-success"
		/>
	) )
	.add( 'Small with No Image', () => (
		<Notification
			id="notification-id"
			title={ __( 'Your Site is Now Registered!', 'google-site-kit' ) }
			description={ __( 'Congrats your site is registered with Search Console!', 'google-site-kit' ) }
			dismiss={ __( 'OK, Got it!', 'google-site-kit' ) }
			learnMoreURL="http://google.com"
			learnMoreLabel={ __( 'Learn More', 'google-site-kit' ) }
			learnMoreDescription={ __( 'about the particular win', 'google-site-kit' ) }
			format="small"
			type="win-success"
		/>
	) )
	.add( 'Small with Error', () => (
		<Notification
			id="notification-id"
			title={ __( 'AMP Validation Error', 'google-site-kit' ) }
			description={ __( 'There are validation errors that need to be fixed.', 'google-site-kit' ) }
			learnMoreURL="http://google.com"
			learnMore={ __( 'View Search Console report', 'google-site-kit' ) }
			learnMoreLabel={ __( 'View Search Console', 'google-site-kit' ) }
			learnMoreDescription={ __( 'report', 'google-site-kit' ) }
			dismiss={ __( 'Dismiss', 'google-site-kit' ) }
			format="small"
			type="win-error"
		/>
	) )
	.add( 'Small with Warning', () => (
		<Notification
			id="notification-id"
			title={ __( 'Index Warning', 'google-site-kit' ) }
			description={ __( 'Indexed, though blocked by robots.text.', 'google-site-kit' ) }
			learnMoreURL="http://google.com"
			learnMoreLabel={ __( 'Learn more', 'google-site-kit' ) }
			dismiss={ __( 'Dismiss', 'google-site-kit' ) }
			format="small"
			ctaLink="http://google.com"
			ctaLabel={ __( 'Validate', 'google-site-kit' ) }
			type="win-warning"
			pageIndex="First detected: 2/13/18"
		/>
	) )
	.add( 'Traffic Increase Win', () => {
		const setupRegistry = ( registry ) => {
			provideModules( registry );
			provideModuleRegistrations( registry );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<Notification
					id="notification-id"
					title={ __( 'Congrats on more website visitors!', 'google-site-kit' ) }
					description={ __( 'You had a record-high amount of visitors to your website yesterday.', 'google-site-kit' ) }
					dismiss={ __( 'OK, Got it!', 'google-site-kit' ) }
					format="large"
					winImage={ sunImage }
					logo
					module="analytics"
					moduleName="Analytics"
					blockData={
						[
							{
								title: 'Site Visitors',
								datapoint: 23780,
							},
							{
								title: 'Increase',
								datapoint: 0.25,
								datapointUnit: '%',
							},
						]
					}
					type="win-stats"
				/>
			</WithTestRegistry>
		);
	} )
	.add( 'Pageview Increase Win', () => (
		<Notification
			id="notification-id"
			title={ __( 'Increased page views!', 'google-site-kit' ) }
			description={ __( 'Over the past 4 weeks', 'google-site-kit' ) }
			dismiss={ __( 'OK, Got it!', 'google-site-kit' ) }
			format="large"
			logo={ true }
			winImage={ sunSmallImage }
			blockData={
				[
					{
						title: 'Total Page Views',
						datapoint: '413',
						datapointUnit: '',
					},
					{
						title: 'Increase',
						datapoint: 0.15,
						datapointUnit: '%',
					},
				]
			}
			type="win-stats-increase"
		/>
	) )
	.add( 'Publishing Win', () => (
		<Notification
			id="notification-id"
			title={ __( 'Congrats on five published posts', 'google-site-kit' ) }
			description={ __( 'That’s out of this world. Here are the combined stats for your posts', 'google-site-kit' ) }
			dismiss={ __( 'OK, Got it!', 'google-site-kit' ) }
			format="large"
			winImage={ rocketImage }
			blockData={
				[
					{
						title: 'Total Views',
						datapoint: 413,
						datapointUnit: '',
					},
					{
						title: 'Average Impressions',
						datapoint: 735,
						datapointUnit: '',
					},
					{
						title: 'Average CTR',
						datapoint: 0.129,
						datapointUnit: '%',
					},
				]
			}
			type="win-stats"
		/>
	) )
	.add( 'Total Stats', () => (
		<Notification
			id="notification-id"
			title={ __( 'Welcome Back!', 'google-site-kit' ) }
			description={ __( 'Last month was great! Here are some high level stats', 'google-site-kit' ) }
			dismiss={ __( 'OK, Got it!', 'google-site-kit' ) }
			format="large"
			winImage={ gWinImage }
			blockData={
				[
					{
						title: 'Total Clicks',
						datapoint: 256,
						datapointUnit: 'K',
						change: 0.20,
						changeDataUnit: '%',
						period: '%s for month',
					},
					{
						title: 'Total Impressions',
						datapoint: 3.5,
						datapointUnit: 'm',
						change: 0.13,
						changeDataUnit: '%',
						period: '%s for month',
					},
					{
						title: 'Average CTR',
						datapoint: 0.029,
						datapointUnit: '%',
						change: 0.05,
						changeDataUnit: '%',
						period: '%s for month',
					},
				]
			}
			type="win-stats"
		/>
	) )
	.add( 'User Input Settings', () => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( CORE_USER ).receiveUserInputState( 'missing' );
			provideSiteInfo( registry );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<UserInputSettings onCTAClick={ ( event ) => event.preventDefault() } />
			</WithTestRegistry>
		);
	} )
	.add( 'User Input Success Notification', () => (
		<UserInputSuccessNotification />
	) );
