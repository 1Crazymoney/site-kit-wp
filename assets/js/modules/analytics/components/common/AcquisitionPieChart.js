/**
 * AcquisitionPieChart component.
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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __, _x, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import GoogleChart from '../../../../components/google-chart';
import { getSiteKitAdminURL, sanitizeHTML } from '../../../../util';
import { extractAnalyticsDataForTrafficChart } from '../../util';

const GOOGLE_CHART_PIE_SETTINGS = {
	chartArea: {
		width: '100%',
		height: '100%',
	},
	backgroundColor: 'transparent',
	height: 250,
	legend: {
		alignment: 'center',
		textStyle: {
			color: '#5b5b61',
			fontSize: 12,
		},
	},
	slices: {
		0: { color: '#178EC5' },
		1: { color: '#54B23B' },
		2: { color: '#EB5729' },
		3: { color: '#ECED33' },
		4: { color: '#34CBE3' },
		5: { color: '#82E88E' },
	},
	title: null,
	width: '100%',
};

function AcquisitionPieChart( { data, source } ) {
	let sourceMessage = '';
	if ( source ) {
		sourceMessage = sprintf(
			/* translators: %1$s: URL to Analytics Module page in Site Kit Admin, %2$s: Analytics (Service Name) */
			__( 'Source: <a class="googlesitekit-cta-link googlesitekit-cta-link--inherit" href="%1$s">%2$s</a>', 'google-site-kit' ),
			getSiteKitAdminURL( 'googlesitekit-module-analytics' ),
			_x( 'Analytics', 'Service name', 'google-site-kit' ),
		);
	}

	return (
		<div className="googlesitekit-chart googlesitekit-chart--pie">
			<GoogleChart
				data={ extractAnalyticsDataForTrafficChart( data, 0 ) }
				options={ GOOGLE_CHART_PIE_SETTINGS }
				chartType="pie"
				id="overview-piechart"
				loadHeight={ 205 }
			/>

			{ source && (
				<div className="googlesitekit-chart__source" dangerouslySetInnerHTML={ sanitizeHTML(
					sourceMessage,
					{
						ALLOWED_TAGS: [ 'a' ],
						ALLOWED_ATTR: [ 'href', 'class' ],
					}
				) } />
			) }
		</div>
	);
}

AcquisitionPieChart.propTypes = {
	data: PropTypes.arrayOf( PropTypes.object ),
	source: PropTypes.bool,
};

AcquisitionPieChart.defaultProps = {
	source: false,
};

export default AcquisitionPieChart;
