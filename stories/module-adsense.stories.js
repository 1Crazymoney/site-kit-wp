/**
 * External dependencies
 */
import { storiesOf } from '@storybook/react';

/**
 * WordPress dependencies
 */
import { doAction } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Layout from '../assets/js/components/layout/layout';
import AdSenseEstimateEarningsWidget
	from '../assets/js/modules/adsense/dashboard/dashboard-widget-estimate-earnings';
import AdSensePerformanceWidget from '../assets/js/modules/adsense/dashboard/dashboard-widget-performance';
import AdSenseDashboardOutro from '../assets/js/modules/adsense/dashboard/dashboard-outro';
import { googlesitekit as adSenseData } from '../.storybook/data/wp-admin-admin.php-page=googlesitekit-module-adsense-googlesitekit';
import {
	AccountSelect,
	UseSnippetSwitch,
	AdBlockerWarning,
} from '../assets/js/modules/adsense/common';
import { WithTestRegistry } from '../tests/js/utils';
import * as fixtures from '../assets/js/modules/adsense/datastore/__fixtures__';
import { STORE_NAME } from '../assets/js/modules/adsense/datastore';

function SetupWrap( { children } ) {
	return (
		<div className="googlesitekit-setup">
			<section className="googlesitekit-setup__wrapper">
				<div className="googlesitekit-setup-module">
					{ children }
				</div>
			</section>
		</div>
	);
}

storiesOf( 'AdSense Module', module )
	.add( 'Account Select, none selected', () => {
		const accounts = fixtures.accountsMultiple;
		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveAccounts( accounts );
			dispatch( STORE_NAME ).receiveSettings( {} );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<SetupWrap>
					<div className="googlesitekit-setup-module__inputs">
						<AccountSelect />
					</div>
				</SetupWrap>
			</WithTestRegistry>
		);
	} )
	.add( 'Account Select, selected', () => {
		const accounts = fixtures.accountsMultiple;
		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveAccounts( accounts );
			dispatch( STORE_NAME ).receiveSettings( {
				accountID: accounts[ 0 ].id,
			} );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<SetupWrap>
					<div className="googlesitekit-setup-module__inputs">
						<AccountSelect />
					</div>
				</SetupWrap>
			</WithTestRegistry>
		);
	} )
	.add( 'Use Snippet Switch, toggled on (default)', () => {
		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).setUseSnippet( true );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<SetupWrap>
					<div className="googlesitekit-setup-module__inputs">
						<UseSnippetSwitch />
					</div>
				</SetupWrap>
			</WithTestRegistry>
		);
	} )
	.add( 'Use Snippet Switch, toggled off', () => {
		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).setUseSnippet( false );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<SetupWrap>
					<div className="googlesitekit-setup-module__inputs">
						<UseSnippetSwitch />
					</div>
				</SetupWrap>
			</WithTestRegistry>
		);
	} )
	.add( 'AdBlocker Warning', () => {
		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveIsAdBlockerActive( true );
		};

		return (
			<WithTestRegistry callback={ setupRegistry }>
				<SetupWrap>
					<div className="googlesitekit-setup-module__inputs">
						<AdBlockerWarning />
					</div>
				</SetupWrap>
			</WithTestRegistry>
		);
	} )
	.add( 'Estimate Earnings', () => {
		global.googlesitekit = adSenseData;

		// Load the datacache with data.
		setTimeout( () => {
			doAction(
				'googlesitekit.moduleLoaded',
				'Single'
			);
		}, 250 );

		return (
			<Layout
				header
				title={ __( 'Estimated earnings', 'google-site-kit' ) }
				headerCtaLabel={ __( 'Advanced Settings', 'google-site-kit' ) }
				headerCtaLink="#"
			>
				<AdSenseEstimateEarningsWidget
					handleDataError={ () => {} }
					handleDataSuccess={ () => {} }
				/>
			</Layout>
		);
	}, {
		options: {
			readySelector: '.googlesitekit-data-block',
		},
	} )
	.add( 'Performance', () => {
		global.googlesitekit = adSenseData;

		// Load the datacache with data.
		setTimeout( () => {
			doAction(
				'googlesitekit.moduleLoaded',
				'Single'
			);
		}, 250 );

		return (
			<Layout
				header
				title={ __( 'Performance over previous 28 days', 'google-site-kit' ) }
				headerCtaLabel={ __( 'Advanced Settings', 'google-site-kit' ) }
				headerCtaLink="#"
			>
				<AdSensePerformanceWidget />
			</Layout>
		);
	} )
	.add( 'AdSense Outro', () => (
		<AdSenseDashboardOutro />
	) );
