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
import './datastore';
import { fillFilterWithComponent } from '../../util';
import { WIDGET_WIDTHS } from '../../googlesitekit/widgets/datastore/constants';
import { AREA_DASHBOARD_SPEED, AREA_PAGE_DASHBOARD_SPEED } from '../../googlesitekit/widgets/default-areas';
import { SettingsMain as PageSpeedInsightsSettings } from './settings';
import DashboardPageSpeedWidget from './components/DashboardPageSpeedWidget';

/**
 * Add components to the settings page.
 */
addFilter(
	'googlesitekit.ModuleSettingsDetails-pagespeed-insights',
	'googlesitekit.PageSpeedInsightsModuleSettingsDetails',
	fillFilterWithComponent( PageSpeedInsightsSettings )
);

domReady( () => {
	global.googlesitekit.widgets.registerWidget( 'pagespeedInsightsWebVitals', {
		component: DashboardPageSpeedWidget,
		width: WIDGET_WIDTHS.FULL,
		wrapWidget: false,
	}, [ AREA_DASHBOARD_SPEED, AREA_PAGE_DASHBOARD_SPEED ] );
} );
