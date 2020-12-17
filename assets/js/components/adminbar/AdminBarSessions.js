/**
 * Admin Bar Sessions component.
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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { readableLargeNumber } from '../../util';
import Data from 'googlesitekit-data';
import DataBlock from '../data-block';
import { STORE_NAME as CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { STORE_NAME as CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import { STORE_NAME as MODULES_ANALYTICS } from '../../modules/analytics/datastore/constants';
import { calculateOverviewData } from '../../modules/analytics/util';
import AdminBarPreview from './AdminBarPreview';
const { useSelect } = Data;

const AdminBarSessions = ( { classNames } ) => {
	const url = useSelect( ( select ) => select( CORE_SITE ).getCurrentEntityURL() );
	const dateRangeDates = useSelect( ( select ) => select( CORE_USER ).getDateRangeDates( {
		compare: true,
	} ) );
	const reportArgs = {
		...dateRangeDates,
		dimensions: 'ga:date',
		limit: 10,
		metrics: [
			{
				expression: 'ga:users',
				alias: 'Users',
			},
			{
				expression: 'ga:sessions',
				alias: 'Sessions',
			},
			{
				expression: 'ga:bounceRate',
				alias: 'Bounce Rate',
			},
			{
				expression: 'ga:avgSessionDuration',
				alias: 'Average Session Duration',
			},
			{
				expression: 'ga:goalCompletionsAll',
				alias: 'Goal Completions',
			},
			{
				expression: 'ga:pageviews',
				alias: 'Pageviews',
			},
		],
		url,
	};
	const analyticsData = useSelect( ( select ) => select( MODULES_ANALYTICS ).getReport( reportArgs ) );

	if ( undefined === analyticsData ) {
		return <AdminBarPreview />;
	}

	const { totalSessions, totalSessionsChange } = calculateOverviewData( analyticsData );

	return (
		<div className={ classNames }>
			<DataBlock
				className="overview-total-sessions"
				title={ __( 'Total Sessions', 'google-site-kit' ) }
				datapoint={ readableLargeNumber( totalSessions ) }
				change={ totalSessionsChange }
				changeDataUnit="%"
			/>
		</div>
	);
};

AdminBarSessions.propTypes = {
	classNames: PropTypes.string,
};

AdminBarSessions.defaultProps = {
	classNames: 'mdc-layout-grid__cell mdc-layout-grid__cell--span-2-tablet mdc-layout-grid__cell--span-3-desktop',
};

export default AdminBarSessions;
