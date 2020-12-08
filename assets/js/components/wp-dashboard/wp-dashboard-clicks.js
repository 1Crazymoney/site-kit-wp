/**
 * WPDashboardClicks component.
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
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from '../../modules/search-console/datastore/constants';
import { STORE_NAME as CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { extractSearchConsoleDashboardData, isZeroReport } from '../../modules/search-console/util';
import { trackEvent } from '../../util/tracking';
import DataBlock from '../data-block';
import PreviewBlock from '../PreviewBlock';
import ReportError from '../ReportError';
import ReportZero from '../ReportZero';
const { useSelect } = Data;

const WPDashboardClicks = () => {
	const { data, error, loading } = useSelect( ( select ) => {
		const store = select( STORE_NAME );

		const args = {
			dateRange: select( CORE_USER ).getDateRange(),
			dimensions: 'date',
			compareDateRanges: true,
		};

		return {
			data: store.getReport( args ),
			error: store.getErrorForSelector( 'getReport', [ args ] ),
			loading: ! store.hasFinishedResolution( 'getReport', [ args ] ),
		};
	} );

	useEffect( () => {
		if ( error ) {
			trackEvent( 'plugin_setup', 'search_console_error', error.message );
		}
	}, [ error ] );

	if ( loading ) {
		return <PreviewBlock width="48%" height="92px" />;
	}

	if ( error ) {
		return <ReportError moduleSlug="search-console" error={ error } />;
	}

	if ( isZeroReport( data ) ) {
		return <ReportZero moduleSlug="search-console" />;
	}

	const {
		totalClicks,
		totalClicksChange,
	} = extractSearchConsoleDashboardData( data );

	return (
		<DataBlock
			className="googlesitekit-wp-dashboard-stats__data-table overview-total-clicks"
			title={ __( 'Total Clicks', 'google-site-kit' ) }
			datapoint={ totalClicks }
			change={ totalClicksChange }
			changeDataUnit="%"
		/>
	);
};

export default WPDashboardClicks;
