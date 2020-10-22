/**
 * User Input Keywords.
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
import { useCallback, useState } from '@wordpress/element';
// import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME as CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { Input, TextField } from '../../material-components';
import Button from '../button';
const { useSelect, useDispatch } = Data;

export default function UserInputKeywords( { slug, max } ) {
	const values = useSelect( ( select ) => select( CORE_USER ).getUserInputSetting( slug ) || [] );
	const [ keyword, setKeyword ] = useState( '' );
	const { setUserInputSetting } = useDispatch( CORE_USER );

	// Need to make sure that dependencies list always has the same number of elements.
	const dependencies = values.concat( Array( max ) ).slice( 0, max );

	const onKeywordChange = useCallback( ( { target } ) => {
		const lastChar = target.value[ target.value.length - 1 ];
		if ( lastChar === ',' ) {
			const textValue = target.value.substring( 0, target.value.length - 1 ).trim();
			if ( textValue ) {
				setUserInputSetting( slug, [ ...values, textValue ] );
			}

			setKeyword( '' );
		} else {
			setKeyword( target.value );
		}
	}, dependencies );

	const onKeywordDelete = useCallback( ( keywordToDelete ) => {
		setUserInputSetting( slug, values.filter( ( value ) => value !== keywordToDelete ) );
	}, dependencies );

	return (
		<div className="
			mdc-layout-grid__cell
			mdc-layout-grid__cell--span-7-desktop
			mdc-layout-grid__cell--span-8-tablet
			mdc-layout-grid__cell--span-4-phone
		">
			<div className="googlesitekit-user-input__text-options">
				{ values.map( ( value ) => (
					<div key={ value } className="googlesitekit-user-input__text-option">
						{ value }
						<Button text onClick={ onKeywordDelete.bind( null, value ) }>x</Button>
					</div>
				) ) }

				{ values.length !== max && (
					<TextField>
						<Input value={ keyword } onChange={ onKeywordChange } />
					</TextField>
				) }
			</div>
		</div>
	);
}

UserInputKeywords.propTypes = {
	slug: PropTypes.string.isRequired,
	max: PropTypes.number,
};

UserInputKeywords.defaultProps = {
	max: 1,
};
