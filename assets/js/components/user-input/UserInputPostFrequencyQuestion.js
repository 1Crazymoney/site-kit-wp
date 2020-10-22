/**
 * User Input Post Frequency Question.
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
import UserInputQuestionWrapper from './UserInputQuestionWrapper';
import UserInputQuestionInfo from './UserInputQuestionInfo';
import UserInputSelectOptions from './UserInputSelectOptions';
import { USER_INPUT_ANSWERS_POST_FREQUENCY } from './util/constants';

export default function UserInputPostFrequencyQuestion( props ) {
	return (
		<UserInputQuestionWrapper slug="postFrequency" { ...props }>
			<UserInputQuestionInfo title={ __( 'How often do you create new post for this site?', 'google-site-kit' ) } />
			<UserInputSelectOptions slug="postFrequency" options={ USER_INPUT_ANSWERS_POST_FREQUENCY } />
		</UserInputQuestionWrapper>
	);
}

UserInputPostFrequencyQuestion.propTypes = {
	isActive: PropTypes.bool,
	questionNumber: PropTypes.number,
	next: PropTypes.func,
	back: PropTypes.func,
};
