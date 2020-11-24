/**
 * DashboardAllTrafficWidget component.
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
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from '../../datastore/constants';
import { STORE_NAME as CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import { STORE_NAME as CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import { STORE_NAME as CORE_MODULES } from '../../../../googlesitekit/modules/datastore/constants';
import PreviewBlock from '../../../../components/PreviewBlock';
import DataBlock from '../../../../components/data-block';
import Sparkline from '../../../../components/Sparkline';
import AnalyticsInactiveCTA from '../../../../components/AnalyticsInactiveCTA';
import { changeToPercent } from '../../../../util';
import applyEntityToReportPath from '../../util/applyEntityToReportPath';
import ReportError from '../../../../components/ReportError';
import ReportZero from '../../../../components/ReportZero';
import parseDimensionStringToDate from '../../util/parseDimensionStringToDate';
import { isZeroReport } from '../../util';

const { useSelect } = Data;

export default function DashboardBounceRateWidget() {
	const analyticsModule = useSelect( ( select ) => select( CORE_MODULES ).getModule( 'analytics' ) );
	const dateRange = useSelect( ( select ) => select( CORE_USER ).getDateRange() );
	const url = useSelect( ( select ) => select( CORE_SITE ).getCurrentEntityURL() );

	const accountID = useSelect( ( select ) => select( STORE_NAME ).getAccountID() );
	const profileID = useSelect( ( select ) => select( STORE_NAME ).getProfileID() );
	const internalWebPropertyID = useSelect( ( select ) => select( STORE_NAME ).getInternalWebPropertyID() );

	const path = applyEntityToReportPath( url, `/report/visitors-overview/a${ accountID }w${ internalWebPropertyID }p${ profileID }/` );
	const serviceURL = useSelect( ( select ) => select( STORE_NAME ).getServiceURL( { path } ), [ path ] );

	const args = {
		dateRange,
		multiDateRange: 1,
		dimensions: 'ga:date',
		metrics: [
			{
				expression: 'ga:bounceRate',
				alias: 'Bounce Rate',
			},
		],
	};

	if ( url ) {
		args.url = url;
	}

	const resolvedReport = useSelect( ( select ) => select( STORE_NAME ).hasFinishedResolution( 'getReport', [ args ] ) );
	const { data, error } = useSelect( ( select ) => {
		if ( ! analyticsModule || ! analyticsModule.active || ! analyticsModule.connected ) {
			return {};
		}

		return {
			data: select( STORE_NAME ).getReport( args ),
			error: select( STORE_NAME ).getErrorForSelector( 'getReport', [ args ] ),
		};
	} );

	if ( ! analyticsModule ) {
		return null;
	}

	if ( ! analyticsModule.active || ! analyticsModule.connected ) {
		return <AnalyticsInactiveCTA />;
	}

	if ( ! resolvedReport ) {
		return <PreviewBlock width="100%" height="202px" />;
	}

	if ( error ) {
		return <ReportError moduleSlug="analytics" error={ error } />;
	}

	if ( isZeroReport( data ) ) {
		return <ReportZero moduleSlug="analytics" />;
	}

	const sparkLineData = [
		[
			{ type: 'date', label: 'Day' },
			{ type: 'number', label: 'Bounce Rate' },
		],
	];

	const dataRows = data[ 0 ].data.rows;
	// We only want half the date range, having `multiDateRange` in the query doubles the range.
	for ( let i = Math.ceil( dataRows.length / 2 ); i < dataRows.length; i++ ) {
		const { values } = dataRows[ i ].metrics[ 0 ];
		const dateString = dataRows[ i ].dimensions[ 0 ];
		const date = parseDimensionStringToDate( dateString );
		sparkLineData.push( [
			date,
			values[ 0 ],
		] );
	}

	const { totals } = data[ 0 ].data;
	const lastMonth = totals[ 0 ].values;
	const previousMonth = totals[ 1 ].values;
	const averageBounceRate = lastMonth[ 0 ];
	const averageBounceRateChange = changeToPercent( previousMonth[ 0 ], lastMonth[ 0 ] );

	return (
		<DataBlock
			className="overview-bounce-rate"
			title={ __( 'Bounce Rate', 'google-site-kit' ) }
			datapoint={ Number( averageBounceRate ).toFixed( 2 ) }
			datapointUnit="%"
			change={ averageBounceRateChange }
			changeDataUnit="%"
			invertChangeColor
			source={ {
				name: _x( 'Analytics', 'Service name', 'google-site-kit' ),
				link: serviceURL,
				external: true,
			} }
			sparkline={
				sparkLineData &&
					<Sparkline
						data={ sparkLineData }
						change={ averageBounceRateChange }
					/>
			}
		/>
	);
}
