/**
 * Admin Bar Unique Visitors component.
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
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import DataBlock from '../DataBlock';
import Data from 'googlesitekit-data';
import PreviewBlock from '../PreviewBlock';
import ReportError from '../ReportError';
import ReportZero from '../ReportZero';
import { STORE_NAME as CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { STORE_NAME as CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import { STORE_NAME as MODULES_ANALYTICS, DATE_RANGE_OFFSET } from '../../modules/analytics/datastore/constants';
import { calculateChange, readableLargeNumber } from '../../util';
import { isZeroReport } from '../../modules/analytics/util/is-zero-report';
const { useSelect } = Data;

const AdminBarUniqueVisitors = ( { className } ) => {
	const url = useSelect( ( select ) => select( CORE_SITE ).getCurrentEntityURL() );
	const dateRangeDates = useSelect( ( select ) => select( CORE_USER ).getDateRangeDates( {
		compare: true,
		offsetDays: DATE_RANGE_OFFSET,
	} ) );
	const reportArgs = {
		...dateRangeDates,
		metrics: [
			{
				expression: 'ga:users',
				alias: 'Total Users',
			},
		],
		url,
	};
	const analyticsData = useSelect( ( select ) => select( MODULES_ANALYTICS ).getReport( reportArgs ) );
	const hasFinishedResolution = useSelect( ( select ) => select( MODULES_ANALYTICS ).hasFinishedResolution( 'getReport', [ reportArgs ] ) );
	const error = useSelect( ( select ) => select( MODULES_ANALYTICS ).getErrorForSelector( 'getReport', [ reportArgs ] ) );

	if ( ! hasFinishedResolution ) {
		return (
			<div className={ classnames(
				'mdc-layout-grid__cell',
				className,
			) }>
				<PreviewBlock width="auto" height="59px" />
			</div>
		);
	}

	if ( error ) {
		return <ReportError moduleSlug="analytics" error={ error } />;
	}

	if ( isZeroReport( analyticsData ) ) {
		return <ReportZero moduleSlug="analytics" />;
	}

	const { totals } = analyticsData[ 0 ].data;
	const lastMonth = totals[ 0 ].values;
	const previousMonth = totals[ 1 ].values;
	const totalUsers = lastMonth[ 0 ];
	const previousTotalUsers = previousMonth[ 0 ];

	return (
		<div className={ classnames(
			'mdc-layout-grid__cell',
			className,
		) }>
			<DataBlock
				className="overview-total-users"
				title={ __( 'Total Users', 'google-site-kit' ) }
				datapoint={ readableLargeNumber( totalUsers ) }
				change={ calculateChange( previousTotalUsers, totalUsers ) }
				changeDataUnit="%"
			/>
		</div>
	);
};

AdminBarUniqueVisitors.propTypes = {
	className: PropTypes.string,
};

AdminBarUniqueVisitors.defaultProps = {
	className: 'mdc-layout-grid__cell--span-2-tablet mdc-layout-grid__cell--span-3-desktop',
};

export default AdminBarUniqueVisitors;
