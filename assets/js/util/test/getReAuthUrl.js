/**
 * Internal dependencies
 */
import { getReAuthURL } from '../';

const createSiteKit = ( apiKey ) => {
	return {
		admin: {
			adminRoot: 'http://sitekit.withgoogle.com/wp-admin/admin.php',
			apikey: apiKey,
			connectUrl: 'http://sitekit.withgoogle.com/wp-admin/admin.php?googlesitekit_connect=1&nonce=12345&page=googlesitekit-splash',
		},
		modules: {
			'search-console': {
				screenID: 'googlesitekit-module-search-console',
			},
			'pagespeed-insights': {
				screenID: 'googlesitekit-module-pagespeed-insights',
			},
		},
		setup: {
			needReauthenticate: false,
		},
	};
};

describe( 'getReAuthURL', () => {
	it( 'should return URL for slug with status/API key', () => {
		let googlesitekit = createSiteKit( false );

		expect(
			getReAuthURL( 'pagespeed-insights', false, googlesitekit )
		).toStrictEqual(
			'http://sitekit.withgoogle.com/wp-admin/admin.php?page=googlesitekit-dashboard&slug=pagespeed-insights&notification=authentication_success'
		);

		googlesitekit = createSiteKit( false );

		expect(
			getReAuthURL( 'pagespeed-insights', true, googlesitekit )
		).toStrictEqual(
			'http://sitekit.withgoogle.com/wp-admin/admin.php?page=googlesitekit-module-pagespeed-insights&slug=pagespeed-insights&notification=authentication_success'
		);

		googlesitekit = createSiteKit( 'abc123' );

		expect(
			getReAuthURL( 'pagespeed-insights', false, googlesitekit )
		).toStrictEqual(
			'http://sitekit.withgoogle.com/wp-admin/admin.php?page=googlesitekit-dashboard&slug=pagespeed-insights&notification=authentication_success'
		);

		googlesitekit = createSiteKit( 'abc123' );

		expect(
			getReAuthURL( 'pagespeed-insights', true, googlesitekit )
		).toStrictEqual(
			'http://sitekit.withgoogle.com/wp-admin/admin.php?page=googlesitekit-module-pagespeed-insights&slug=pagespeed-insights&notification=authentication_success'
		);
	} );
} );

