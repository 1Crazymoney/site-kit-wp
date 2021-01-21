/**
 * Widgets component props utilities.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
import WidgetReportZero from '../components/WidgetReportZero';
import WidgetActivateModuleCTA from '../components/WidgetActivateModuleCTA';
import WidgetCompleteModuleActivationCTA from '../components/WidgetCompleteModuleActivationCTA';

/**
 * Gets the props to pass to a widget's component.
 *
 * @since n.e.x.t
 *
 * @param {string} widgetSlug The widget's slug.
 * @return {Object} Props to pass to the widget component.
 */
export function getWidgetComponentProps( widgetSlug ) {
	// Scope widget-specific components to the widget instance so that the
	// component does not need to (re-)specify the widget slug.
	return {
		WidgetReportZero: withWidgetSlug( widgetSlug )( WidgetReportZero ),
		WidgetActivateModuleCTA: withWidgetSlug( widgetSlug )( WidgetActivateModuleCTA ),
		WidgetCompleteModuleActivationCTA: withWidgetSlug( widgetSlug )( WidgetCompleteModuleActivationCTA ),
	};
}

function withWidgetSlug( widgetSlug ) {
	return ( WrappedComponent ) => {
		return ( props ) => <WrappedComponent { ...props } widgetSlug={ widgetSlug } />;
	};
}
