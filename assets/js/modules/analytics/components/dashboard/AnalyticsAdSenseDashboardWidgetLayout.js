/**
 * AnalyticsAdSenseDashboardWidgetLayout component.
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
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { DATE_RANGE_OFFSET } from '../../../adsense/datastore/constants';
import { MODULES_ANALYTICS } from '../../../analytics/datastore/constants';
import { CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import Layout from '../../../../components/layout/Layout';
import { getCurrentDateRangeDayCount } from '../../../../util/date-range';
const { useSelect } = Data;

const AnalyticsAdSenseDashboardWidgetLayout = ( { children } ) => {
	const { startDate, endDate } = useSelect( ( select ) => select( CORE_USER ).getDateRangeDates( {
		offsetDays: DATE_RANGE_OFFSET,
	} ) );
	const accountSiteURL = useSelect( ( select ) => select( MODULES_ANALYTICS ).getServiceReportURL(
		'content-publisher-overview',
		{ '_u.date00': startDate, '_u.date01': endDate },
	) );
	const dateRange = useSelect( ( select ) => select( CORE_USER ).getDateRange() );
	const currentDayCount = getCurrentDateRangeDayCount( dateRange );

	return (
		<Layout
			header
			title={ sprintf(
				/* translators: %s: number of days */
				_n( 'Performance by page over the last %s day', 'Performance by page over the last %s days', currentDayCount, 'google-site-kit', ),
				currentDayCount,
			) }
			headerCTALabel={ __( 'See full stats in Analytics', 'google-site-kit' ) }
			headerCTALink={ accountSiteURL }>
			{ children }
		</Layout>
	);
};

export default AnalyticsAdSenseDashboardWidgetLayout;
