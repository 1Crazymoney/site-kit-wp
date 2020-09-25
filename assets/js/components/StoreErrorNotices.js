/**
 * StoreErrorNotices component.
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
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { isPermissionScopeError } from '../util/errors';
import ErrorNotice from './ErrorNotice';
const { useSelect } = Data;

function StoreErrorNotices( { moduleSlug, storeName, shouldDisplayError } ) {
	const errors = useSelect( ( select ) => select( storeName ).getErrors() );

	if ( Array.isArray( errors ) && errors.length > 0 ) {
		const errorNotices = errors.map( ( error, key ) => {
			// Do not display if no error, or if the error is for missing scopes.
			if ( ! error || isPermissionScopeError( error ) || ! shouldDisplayError( error ) ) {
				return null;
			}

			return <ErrorNotice
				moduleSlug={ moduleSlug }
				error={ error }
				shouldDisplayError={ shouldDisplayError }
				key={ key }
			/>;
		} );

		return errorNotices;
	}

	return null;
}

StoreErrorNotices.propTypes = {
	moduleSlug: PropTypes.string,
	storeName: PropTypes.string.isRequired,
	shouldDisplayError: PropTypes.func,
};

StoreErrorNotices.defaultProps = {
	moduleSlug: '',
	shouldDisplayError: () => true,
};

export default StoreErrorNotices;
