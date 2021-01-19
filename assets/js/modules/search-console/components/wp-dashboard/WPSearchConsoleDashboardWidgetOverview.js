/**
 * WPSearchConsoleDashboardWidgetOverview component.
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
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getTimeInSeconds } from '../../../../util';
import PreviewBlocks from '../../../../components/PreviewBlock';
import DataBlock from '../../../../components/DataBlock';
import withData from '../../../../components/higherorder/withData';
import { TYPE_MODULES } from '../../../../components/data';
import {
	extractSearchConsoleDashboardData,
	isDataZeroSearchConsole,
} from '../../util';
import getNoDataComponent from '../../../../components/legacy-notifications/nodata';

class WPSearchConsoleDashboardWidgetOverview extends Component {
	render() {
		const { data } = this.props;

		if ( ! data || ! data.length ) {
			return null;
		}
		const processedData = extractSearchConsoleDashboardData( data );

		const {
			totalClicks,
			totalImpressions,
			totalClicksChange,
			totalImpressionsChange,
		} = processedData;

		return (
			<Fragment>
				{ ! data.length
					? <div className="googlesitekit-wp-dashboard-stats__cta">
						{ getNoDataComponent( _x( 'Search Console', 'Service name', 'google-site-kit' ) ) }
					</div>
					: <Fragment>
						<DataBlock
							className="googlesitekit-wp-dashboard-stats__data-table overview-total-impressions"
							title={ __( 'Total Impressions', 'google-site-kit' ) }
							datapoint={ totalImpressions }
							change={ totalImpressionsChange }
							changeDataUnit="%"
						/>
						<DataBlock
							className="googlesitekit-wp-dashboard-stats__data-table overview-total-clicks"
							title={ __( 'Total Clicks', 'google-site-kit' ) }
							datapoint={ totalClicks }
							change={ totalClicksChange }
							changeDataUnit="%"
						/>
					</Fragment>
				}
			</Fragment>
		);
	}
}

export default withData(
	WPSearchConsoleDashboardWidgetOverview,
	[
		{
			type: TYPE_MODULES,
			identifier: 'search-console',
			datapoint: 'searchanalytics',
			data: {
				dimensions: 'date',
				compareDateRanges: true,
			},
			priority: 1,
			maxAge: getTimeInSeconds( 'day' ),
			context: [ 'WPDashboard' ],
		},
	],
	<PreviewBlocks
		width="23%"
		height="94px"
		count={ 2 }
	/>,
	{},
	isDataZeroSearchConsole
);
