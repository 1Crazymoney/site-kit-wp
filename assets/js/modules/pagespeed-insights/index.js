/**
 * PageSpeed Insights module initialization.
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
import { addFilter } from '@wordpress/hooks';
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import Widgets from 'googlesitekit-widgets';
import './datastore';
import { fillFilterWithComponent, getModulesData } from '../../util';
import { createAddToFilter } from '../../util/helpers';
import { SettingsMain as PageSpeedInsightsSettings } from './components/settings';
import DashboardPageSpeedWidget from './components/DashboardPageSpeedWidget';
import DashboardPageSpeedCTA from './components/DashboardPageSpeedCTA';

/**
 * Add components to the settings page.
 */
addFilter(
	'googlesitekit.ModuleSettingsDetails-pagespeed-insights',
	'googlesitekit.PageSpeedInsightsModuleSettingsDetails',
	fillFilterWithComponent( PageSpeedInsightsSettings )
);

const { active, setupComplete } = getModulesData()[ 'pagespeed-insights' ];
if ( ! active || ! setupComplete ) {
	addFilter(
		'googlesitekit.DashboardModule',
		'googlesitekit.PageSpeedInsights',
		createAddToFilter( <DashboardPageSpeedCTA /> ),
		45
	);
}

domReady( () => {
	const { AREA_DASHBOARD_SPEED, AREA_PAGE_DASHBOARD_SPEED } = Widgets.areas;

	Widgets.registerWidget( 'pagespeedInsightsWebVitals', {
		component: DashboardPageSpeedWidget,
		width: Widgets.widths.FULL,
		wrapWidget: false,
	}, [ AREA_DASHBOARD_SPEED, AREA_PAGE_DASHBOARD_SPEED ] );
} );
