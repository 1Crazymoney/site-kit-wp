/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import SiteKitRegistry from 'assets/js/googlesitekit/data';
import { registerSiteKitStores } from 'assets/js/googlesitekit/data/store';
import { collectReducers } from 'assets/js/googlesitekit/data/utils';

if ( typeof global.googlesitekit === 'undefined' ) {
	global.googlesitekit = {};
}

if ( typeof global.googlesitekit.data === 'undefined' ) {
	global.googlesitekit.data = { collectReducers, registerSiteKitStores, registry: SiteKitRegistry };
	// Register all stores on the default Site Kit registry.
	registerSiteKitStores( global.googlesitekit.data.registry );
}

export { collectReducers };

export default SiteKitRegistry;
