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
import { useCallback, useState, Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME as CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { STORE_NAME as CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import { Cell, Row } from '../../material-components';
import Button from '../button';
import ProgressBar from '../ProgressBar';
import ErrorNotice from '../ErrorNotice';
import UserInputPreviewGroup from './UserInputPreviewGroup';
import UserInputQuestionNotice from './UserInputQuestionNotice';
import { getUserInputAnwsers } from './util/constants';
import { addQueryArgs } from '@wordpress/url';
const { useSelect, useDispatch } = Data;

export default function UserInputPreview( { footer, back, goTo, redirectURL } ) {
	const [ isNavigating, setIsNavigating ] = useState( false );

	const dashboardURL = useSelect( ( select ) => select( CORE_SITE ).getAdminURL( 'googlesitekit-dashboard' ) );
	const settings = useSelect( ( select ) => select( CORE_USER ).getUserInputSettings() );
	const { isSavingSettings, error } = useSelect( ( select ) => ( {
		isSavingSettings: select( CORE_USER ).isFetchingSaveUserInputSettings(),
		error: select( CORE_USER ).getErrorForAction( 'saveUserInputSettings', [] ),
	} ) );

	const { saveUserInputSettings } = useDispatch( CORE_USER );
	const submitChanges = useCallback( async () => {
		setIsNavigating( true );
		const response = await saveUserInputSettings();
		if ( ! response.error ) {
			let [ sanitizedRedirectURL, hash ] = ( redirectURL ?? dashboardURL ).split( '#' );
			sanitizedRedirectURL = addQueryArgs( sanitizedRedirectURL, { notification: 'user_input_success' } );
			if ( hash ) {
				sanitizedRedirectURL += `#${ hash }`;
			}
			global.location.assign( sanitizedRedirectURL );
		} else {
			setIsNavigating( false );
		}
	}, [ dashboardURL ] );

	const {
		USER_INPUT_ANSWERS_GOALS,
		USER_INPUT_ANSWERS_HELP_NEEDED,
		USER_INPUT_ANSWERS_POST_FREQUENCY,
		USER_INPUT_ANSWERS_ROLE,
	} = getUserInputAnwsers();

	return (
		<div className="googlesitekit-user-input__preview">
			<Row>
				<Cell lgSize={ 12 } mdSize={ 8 } smSize={ 4 }>
					{ ( isSavingSettings || isNavigating ) && (
						<ProgressBar />
					) }
					{ ! isSavingSettings && ! isNavigating && (
						<Fragment>
							<Row>
								<Cell lgSize={ 6 } mdSize={ 8 } smSize={ 4 }>
									<UserInputPreviewGroup
										title={ __( '1 — Which best describes your team/role relation to this site?', 'google-site-kit' ) }
										edit={ goTo.bind( null, 1 ) }
										values={ settings?.role?.values || [] }
										options={ USER_INPUT_ANSWERS_ROLE }
									/>

									<UserInputPreviewGroup
										title={ __( '2 — How often do you create new posts for this site?', 'google-site-kit' ) }
										edit={ goTo.bind( null, 2 ) }
										values={ settings?.postFrequency?.values || [] }
										options={ USER_INPUT_ANSWERS_POST_FREQUENCY }
									/>

									<UserInputPreviewGroup
										title={ __( '3 — What are the goals of this site?', 'google-site-kit' ) }
										edit={ goTo.bind( null, 3 ) }
										values={ settings?.goals?.values || [] }
										options={ USER_INPUT_ANSWERS_GOALS }
									/>
								</Cell>
								<Cell lgSize={ 6 } mdSize={ 8 } smSize={ 4 }>
									<UserInputPreviewGroup
										title={ __( '4 — What do you need help most with for this site?', 'google-site-kit' ) }
										edit={ goTo.bind( null, 4 ) }
										values={ settings?.helpNeeded?.values || [] }
										options={ USER_INPUT_ANSWERS_HELP_NEEDED }
									/>

									<UserInputPreviewGroup
										title={ __( '5 — To help us identify opportunities for your site, enter the top three search terms that you’d like to show up for:', 'google-site-kit' ) }
										edit={ goTo.bind( null, 5 ) }
										values={ settings?.searchTerms?.values || [] }
									/>
								</Cell>
							</Row>

							{ error && <ErrorNotice error={ error } /> }

							{ footer && (
								<div className="googlesitekit-user-input__preview--footer">
									<UserInputQuestionNotice />

									<div className="googlesitekit-user-input__buttons">
										<Button text onClick={ back }>{ __( 'Back', 'google-site-kit' ) }</Button>
										<Button onClick={ submitChanges }>{ __( 'Submit', 'google-site-kit' ) }</Button>
									</div>
								</div>
							) }
						</Fragment>
					) }
				</Cell>
			</Row>
		</div>
	);
}

UserInputPreview.propTypes = {
	footer: PropTypes.bool,
	back: PropTypes.func,
	goTo: PropTypes.func.isRequired,
	redirectURL: PropTypes.string,
};
