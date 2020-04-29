/**
 * Validation utilities.
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
 * Internal dependencies
 */
import { ACCOUNT_CREATE, CONTAINER_CREATE } from '../datastore/constants';

/**
 * Checks the given value to see if it is a positive integer.
 *
 * @param {*} input Value to check.
 * @return {boolean} Validity.
 */
const isValidNumericID = function( input ) {
	const id = parseInt( input, 10 ) || 0;

	return id > 0;
};

/**
 * Checks if the given account ID appears to be a valid Tag Manager account.
 *
 * @param {(string|number)} accountID Account ID to test.
 * @return {boolean} Whether or not the given account ID is valid.
 */
export { isValidNumericID as isValidAccountID };

/**
 * Checks if the given value is a valid selection for an Account.
 *
 * @param {?string} value Selected value
 * @return {boolean} True if valid, otherwise false.
 */
export function isValidAccountSelection( value ) {
	if ( value === ACCOUNT_CREATE ) {
		return true;
	}

	return isValidNumericID( value );
}

/**
 * Checks if the given container ID appears to be a valid GTM container.
 *
 * @param {string} containerID Container ID to check.
 * @return {boolean} Whether or not the given container ID is valid.
 */
export default function isValidContainerID( containerID ) {
	return ( !! containerID ) && containerID.toString().match( /^GTM-[A-Z0-9]+$/ );
}

/**
 * Checks if the given value is a valid selection for a container.
 *
 * @param {?string} value Selected value
 * @return {boolean} True if valid, otherwise false.
 */
export function isValidContainerSelection( value ) {
	if ( value === CONTAINER_CREATE ) {
		return true;
	}

	return isValidContainerID( value );
}

/**
 * Checks if the given internal container ID appears to be valid.
 *
 * @param {(string|number)} internalContainerID Internal container ID to test.
 * @return {boolean} Whether or not the given ID is valid.
 */
export { isValidNumericID as isValidInternalContainerID };
