/**
 * Report normalization utilities.
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
import castArray from 'lodash/castArray';
import isPlainObject from 'lodash/isPlainObject';
import memize from 'memize';

/**
 * Normalizes report options.
 *
 * @since 1.17.0
 *
 * @param {Object} options Report options object.
 * @return {Object} Normalized options object.
 */
export const normalizeReportOptions = memize(
	( { metrics, dimensions, dimensionFilters, ...options } = {} ) => {
		// TODO: build this out to normalize all options used.
		return {
			metrics: normalizeMetrics( metrics ),
			dimensions: normalizeDimensions( dimensions ),
			dimensionFilters: normalizeDimensionFilters( dimensionFilters ),
			...options,
		};
	}
);

const normalizeMetrics = ( metrics ) => {
	return castArray( metrics )
		.map(
			( metric ) => typeof metric === 'string'
				? { expression: metric }
				: metric
		)
		.filter( ( metric ) => isPlainObject( metric ) )
	;
};

const normalizeDimensions = ( dimensions ) => {
	return castArray( dimensions )
		.map(
			( dimension ) => typeof dimension === 'string'
				? { name: dimension }
				: dimension
		)
		.filter( ( dimension ) => isPlainObject( dimension ) )
	;
};

const normalizeDimensionFilters = ( dimensionFilters ) => {
	const normalizedFilters = {};
	if ( isPlainObject( dimensionFilters ) ) {
		for ( const [ key, value ] of Object.entries( dimensionFilters ) ) {
			if ( typeof value === 'string' ) {
				normalizedFilters[ key ] = value;
			}
		}
	}
	return normalizedFilters;
};
