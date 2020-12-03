/**
 * Feature control utilities.
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
import set from 'lodash/set';

function setFeatureActive( feature, active ) {
	set( global, `featureFlags.${ feature }.enabled`, active );
}

/**
 * Enables a feature.
 *
 * @since n.e.x.t
 *
 * @param {string} feature Feature to enable.
 */
export function enableFeature( feature ) {
	setFeatureActive( feature, true );
}

/**
 * Disables a feature.
 *
 * @since n.e.x.t
 *
 * @param {string} feature Feature to disable.
 */
export function disableFeature( feature ) {
	setFeatureActive( feature, false );
}
