/**
 * PageSpeed Insights Lab Data report metrics component.
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
import { __, _x, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import ReportMetric from './ReportMetric';
import Link from '../../../components/link';
import { sanitizeHTML } from '../../../util';
import { STORE_NAME as CORE_SITE } from '../../../googlesitekit/datastore/site/constants';

const { useSelect } = Data;

export default function FieldReportMetrics( { data } ) {
	const permalink = global._googlesitekitLegacyData.permaLink;
	const referenceURL = useSelect( ( select ) => select( CORE_SITE ).getReferenceSiteURL() );
	const url = permalink || referenceURL;

	const learnMoreLink = (
		<Link
			href="https://web.dev/user-centric-performance-metrics/#in-the-field"
			external
			inherit
			dangerouslySetInnerHTML={ sanitizeHTML(
				__( 'Learn more<span class="screen-reader-text"> about field data.</span>', 'google-site-kit' ),
				{
					ALLOWED_TAGS: [ 'span' ],
					ALLOWED_ATTR: [ 'class' ],
				}
			) }
		/>
	);

	const {
		FIRST_INPUT_DELAY_MS: firstInputDelay,
		LARGEST_CONTENTFUL_PAINT_MS: largestContentfulPaint,
		CUMULATIVE_LAYOUT_SHIFT_SCORE: cumulativeLayoutShift,
	} = data?.loadingExperience?.metrics || {};

	if ( ! firstInputDelay || ! largestContentfulPaint || ! cumulativeLayoutShift ) {
		return (
			<div>
				<h3>
					{ __( 'Field data unavailable', 'google-site-kit' ) }
				</h3>
				<p>
					{ __( 'Field data is useful for capturing true, real-world user experience. However, the Chrome User Experience Report does not have sufficient real-world speed data for this page.', 'google-site-kit' ) }
				</p>
				{ learnMoreLink }
			</div>
		);
	}

	const footerLinkHTML = (
		<p
			dangerouslySetInnerHTML={ sanitizeHTML(
				sprintf(
					/* translators: 1: link attributes, 2: translated service name */
					__( 'View details at <a %1$s>%2$s</a>', 'google-site-kit' ),
					`href="${ addQueryArgs( 'https://developers.google.com/speed/pagespeed/insights/', { url } ) }" class="googlesitekit-cta-link googlesitekit-cta-link--external" target="_blank"`,
					_x( 'PageSpeed Insights', 'Service name', 'google-site-kit' )
				),
				{
					ALLOWED_TAGS: [ 'a' ],
					ALLOWED_ATTR: [ 'href', 'class', 'target' ],
				}
			) }
		/>
	);

	// Convert milliseconds to seconds with 1 fraction digit.
	const lcpSeconds = ( Math.round( largestContentfulPaint.percentile / 100 ) / 10 ).toFixed( 1 );
	// Convert 2 digit score to a decimal between 0 and 1, with 2 fraction digits.
	const cls = ( cumulativeLayoutShift.percentile / 100 ).toFixed( 2 );

	return (
		<div className="googlesitekit-layout googlesitekit-pagespeed-insights-web-vitals-metrics">
			<div>
				<p>
					{ __( 'Field data is useful for capturing true, real-world user experience - but has a more limited set of metrics.', 'google-site-kit' ) }
					{ ' ' }
					{ learnMoreLink }
				</p>
			</div>
			<table
				className={ classnames(
					'googlesitekit-table',
					'googlesitekit-table--with-list'
				) }
			>
				<thead>
					<tr>
						<th>
							{ __( 'Metric Name', 'google-site-kit' ) }
						</th>
						<th>
							{ __( 'Metric Value', 'google-site-kit' ) }
						</th>
					</tr>
				</thead>
				<tbody>
					<ReportMetric
						title={ __( 'First Input Delay', 'google-site-kit' ) }
						description={ __( 'Helps measure your user’s first impression of your site’s interactivity and responsiveness.', 'google-site-kit' ) }
						displayValue={ `${ firstInputDelay.percentile } ms` }
						category={ firstInputDelay.category }
					/>
					<ReportMetric
						title={ __( 'Largest Contentful Paint', 'google-site-kit' ) }
						description={ __( 'Marks the time at which the largest text or image is painted.', 'google-site-kit' ) }
						displayValue={ `${ lcpSeconds } s` }
						category={ largestContentfulPaint.category }
					/>
					<ReportMetric
						title={ __( 'Cumulative Layout Shift', 'google-site-kit' ) }
						description={ __( 'Measures the movement of visible elements within the viewport.', 'google-site-kit' ) }
						displayValue={ cls }
						category={ cumulativeLayoutShift.category }
					/>
				</tbody>
			</table>
			<div>
				{ footerLinkHTML }
			</div>
		</div>
	);
}

FieldReportMetrics.propTypes = {
	data: PropTypes.object.isRequired,
};
