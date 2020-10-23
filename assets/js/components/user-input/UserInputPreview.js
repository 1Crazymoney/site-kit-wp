/**
 * User Input Preview.
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
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME as CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { Cell, Row } from '../../material-components';
import Button from '../button';
import UserInputPreviewGroup from './UserInputPreviewGroup';
import UserInputQuestionNotice from './UserInputQuestionNotice';
import {
	USER_INPUT_ANSWERS_GOALS,
	USER_INPUT_ANSWERS_HELP_NEEDED,
	USER_INPUT_ANSWERS_POST_FREQUENCY,
	USER_INPUT_ANSWERS_ROLE,
} from './util/constants';
const { useSelect, useDispatch } = Data;

export default function UserInputPreview( { back } ) {
	const settings = useSelect( ( select ) => select( CORE_USER ).getUserInputSettings() );

	const { saveUserInputSettings } = useDispatch( CORE_USER );
	const submitChanges = useCallback( () => {
		saveUserInputSettings( settings );
	}, [] );

	return (
		<div className="googlesitekit-user-input__preview">
			<Row>
				<Cell>
					<Row>
						<Cell lg={ 6 }>
							<UserInputPreviewGroup
								title={ __( '1 — Which best describes your team/role relation to this site?', 'google-site-kit' ) }
								edit={ back.bind( null, 5 ) }
								values={ settings.role || [] }
								options={ USER_INPUT_ANSWERS_ROLE }
							/>

							<UserInputPreviewGroup
								title={ __( '2 — How often do you create new posts for this site?', 'google-site-kit' ) }
								edit={ back.bind( null, 4 ) }
								values={ settings.postFrequency || [] }
								options={ USER_INPUT_ANSWERS_POST_FREQUENCY }
							/>

							<UserInputPreviewGroup
								title={ __( '3 — What are the goals of this site?', 'google-site-kit' ) }
								edit={ back.bind( null, 3 ) }
								values={ settings.goals || [] }
								options={ USER_INPUT_ANSWERS_GOALS }
							/>
						</Cell>
						<Cell lg={ 6 }>
							<UserInputPreviewGroup
								title={ __( '4 — What do you need help most with for this site?', 'google-site-kit' ) }
								edit={ back.bind( null, 2 ) }
								values={ settings.helpNeeded || [] }
								options={ USER_INPUT_ANSWERS_HELP_NEEDED }
							/>

							<UserInputPreviewGroup
								title={ __( '5 — To help us identify opportunities for your site, enter the top three search terms that you’d like to show up for:', 'google-site-kit' ) }
								edit={ back.bind( null, 1 ) }
								values={ settings.searchTerms || [] }
							/>
						</Cell>
					</Row>

					<div className="googlesitekit-user-input__buttons">
						<UserInputQuestionNotice />

						<div>
							<Button text onClick={ back }>{ __( 'Back', 'google-site-kit' ) }</Button>
							<Button onClick={ submitChanges }>{ __( 'Submit', 'google-site-kit' ) }</Button>
						</div>
					</div>
				</Cell>
			</Row>
		</div>
	);
}

UserInputPreview.propTypes = {
	back: PropTypes.func.isRequired,
};
