/**
 * Dashboard PageSpeed Widget component.
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
import Widgets from 'googlesitekit-widgets';
import DashboardPageSpeed from './DashboardPageSpeed';
import whenActive from '../../../../util/when-active';
import ActivateModuleCTA from '../../../../components/ActivateModuleCTA';
import CompleteModuleActivationCTA from '../../../../components/CompleteModuleActivationCTA';
const { Widget } = Widgets.components;

function DashboardPageSpeedWidget() {
	// Pass class to omit regular widget padding and legacy widget class to use original styles.
	return (
		<Widget
			slug="pagespeedInsightsWebVitals"
			className="googlesitekit-pagespeed-widget"
			noPadding
		>
			<DashboardPageSpeed />
		</Widget>
	);
}

export default whenActive( {
	moduleName: 'pagespeed-insights',
	FallbackComponent: () => <ActivateModuleCTA moduleSlug="pagespeed-insights" />,
	IncompleteComponent: () => <CompleteModuleActivationCTA slug="pagespeed-insights" />,
} )( DashboardPageSpeedWidget );
