/**
 * Admin Bar Impressions component.
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
import Data from 'googlesitekit-data';
import DataBlock from '../data-block';
import { extractSearchConsoleDashboardData } from '../../modules/search-console/util';
import { STORE_NAME as CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { STORE_NAME as CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import { STORE_NAME as MODULES_SEARCH_CONSOLE } from '../../modules/search-console/datastore/constants';
import AdminBarPreview from './AdminBarPreview';
const { useSelect } = Data;

const AdminBarImpressions = ( { classNames } ) => {
	const url = useSelect( ( select ) => select( CORE_SITE ).getCurrentEntityURL() );
	const dateRangeDates = useSelect( ( select ) => select( CORE_USER ).getDateRangeDates( {
		compare: true,
	} ) );
	const reportArgs = {
		...dateRangeDates,
		dimensions: 'date',
		url,
	};
	const searchConsoleData = useSelect( ( select ) => select( MODULES_SEARCH_CONSOLE ).getReport( reportArgs ) );

	if ( undefined === searchConsoleData ) {
		return <AdminBarPreview />;
	}

	const {
		totalImpressions,
		totalImpressionsChange,
	} = extractSearchConsoleDashboardData( searchConsoleData );

	return (
		<div className={ classNames }>
			<DataBlock
				className="overview-total-impressions"
				title={ __( 'Total Impressions', 'google-site-kit' ) }
				datapoint={ totalImpressions }
				change={ totalImpressionsChange }
				changeDataUnit="%"
			/>
		</div>
	);
};

AdminBarImpressions.propTypes = {
	classNames: PropTypes.string,
};

AdminBarImpressions.defaultProps = {
	classNames: 'mdc-layout-grid__cell mdc-layout-grid__cell--span-2-tablet mdc-layout-grid__cell--span-3-desktop',
};

export default AdminBarImpressions;
