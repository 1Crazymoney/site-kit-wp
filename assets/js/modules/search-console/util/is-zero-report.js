/**
 * Report utilities.
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
 * Checks whether the report data is valid.
 *
 * @since n.e.x.t
 *
 * @param {Object} report Report data object.
 * @return {boolean | undefined} Returns undefined if in the loading state, true if the report has no data or missing data, otherwise false.
 */
export function isZeroReport( report ) {
	if ( report === undefined ) {
		return undefined;
	}

	if ( ! report?.length || ( typeof report !== 'object' && report !== null ) ) {
		return true;
	}

	const sumOfMetrics = report.reduce( function( sum, values ) {
		return sum + values.clicks + values.impressions + values.ctr + values.position;
	}, 0 );

	if ( sumOfMetrics === 0 ) {
		return true;
	}

	// false means there _is_ valid report data
	return false;
}
