/**
 * TotalUserCount component
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
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME as CORE_SITE } from '../../../../../googlesitekit/datastore/site/constants';
import { STORE_NAME as CORE_USER } from '../../../../../googlesitekit/datastore/user/constants';
import { STORE_NAME, DATE_RANGE_OFFSET } from '../../../datastore/constants';
import { numFmt, calculateChange } from '../../../../../util';
import { getAvailableDateRanges } from '../../../../../util/date-range';
import { isZeroReport } from '../../../util';
import ChangeArrow from '../../../../../components/ChangeArrow';
import PreviewBlock from '../../../../../components/PreviewBlock';
const { useSelect } = Data;

export default function TotalUserCount( { dimensionName, dimensionValue } ) {
	const url = useSelect( ( select ) => select( CORE_SITE ).getCurrentEntityURL() );
	const dateRange = useSelect( ( select ) => select( CORE_USER ).getDateRange() );
	const dateRangeDates = useSelect( ( select ) => select( CORE_USER ).getDateRangeDates( {
		compare: true,
		offsetDays: DATE_RANGE_OFFSET,
	} ) );

	const args = {
		...dateRangeDates,
		metrics: [
			{
				expression: 'ga:users',
				alias: 'Users',
			},
		],
	};

	if ( url ) {
		args.url = url;
	}

	if ( dimensionName && dimensionValue ) {
		args.dimensionFilters = {
			[ dimensionName ]: dimensionValue,
		};
	}

	const loaded = useSelect( ( select ) => select( STORE_NAME ).hasFinishedResolution( 'getReport', [ args ] ) );
	const error = useSelect( ( select ) => select( STORE_NAME ).getErrorForSelector( 'getReport', [ args ] ) );
	const report = useSelect( ( select ) => select( STORE_NAME ).getReport( args ) );

	if ( ! loaded ) {
		return (
			<PreviewBlock
				className="googlesitekit-widget--analyticsAllTrafficV2__totalcount--loading"
				width="220px"
				height="130px"
				shape="square"
			/>
		);
	}

	if ( error || isZeroReport( report ) ) {
		// The UserCountGraph component will return appropriate ReportError/ReportZero component
		// based on the report fetching status, so we can return just NULL here to make sure it doesn't take extra space.
		return null;
	}

	const { totals } = report?.[ 0 ]?.data || {};
	const [ current, previous ] = totals || [];
	const change = calculateChange( previous?.values?.[ 0 ], current?.values?.[ 0 ] );

	let currentDateRangeLabel = null;
	const currentDateRangeDays = getAvailableDateRanges()[ dateRange ]?.days;
	if ( currentDateRangeDays ) {
		currentDateRangeLabel = sprintf(
			/* translators: %s number of days */
			__( 'in the last %s days', 'google-site-kit' ),
			currentDateRangeDays,
		);
	}

	return (
		<div className="googlesitekit-widget--analyticsAllTrafficV2__totalcount">
			<h3>
				{ __( 'Users', 'google-site-kit' ) }
				{ dimensionValue && (
					<span>{ dimensionValue[ 0 ].toUpperCase() }{ dimensionValue.substring( 1 ) }</span>
				) }
			</h3>
			<h2>
				{ numFmt( current?.values?.[ 0 ] ) }
			</h2>
			<div>
				<span className={ classnames( 'googlesitekit-widget--analyticsAllTrafficV2__totalcount--change', {
					'googlesitekit-widget--analyticsAllTrafficV2__totalcount--up-change': 0 <= change,
					'googlesitekit-widget--analyticsAllTrafficV2__totalcount--down-change': 0 > change,
				} ) }>
					<ChangeArrow
						direction={ 0 <= change ? 'up' : 'down' }
						width={ 18 }
						height={ 17 }
					/>

					{ numFmt( Math.abs( change ), { style: 'percent', maximumFractionDigits: 1 } ) }
				</span>
				<span className="googlesitekit-widget--analyticsAllTrafficV2__totalcount--daterange">
					{ currentDateRangeLabel }
				</span>
			</div>
		</div>
	);
}

TotalUserCount.propTypes = {
	dimensionName: PropTypes.string.isRequired,
	dimensionValue: PropTypes.string,
};
