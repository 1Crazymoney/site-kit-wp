/**
 * Activation App component.
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
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { trackEvent } from '../../util';
import { ActivationMain } from './activation-main';
import NotificationCounter from '../notifications/notification-counter';

export class ActivationApp extends Component {
	render() {
		const { proxySetupURL, splashURL } = global._googlesitekitBaseData;
		const { canViewDashboard } = global.googlesitekit.permissions;
		const { dashboardPermalink } = global.googlesitekit;

		let buttonURL = proxySetupURL || splashURL;
		let buttonLabel = __( 'Start setup', 'google-site-kit' );

		if ( canViewDashboard ) {
			buttonURL = dashboardPermalink;
			buttonLabel = __( 'Go to Dashboard', 'google-site-kit' );
		}

		const onButtonClick = async ( event ) => {
			event.preventDefault();
			await trackEvent( 'plugin_setup', proxySetupURL ? 'proxy_start_setup_banner' : 'goto_sitekit' );
			global.location.assign( buttonURL );
		};

		return (
			<Fragment>
				<NotificationCounter />
				<ActivationMain
					buttonURL={ buttonURL }
					buttonLabel={ buttonLabel }
					onButtonClick={ onButtonClick }
				/>
			</Fragment>
		);
	}
}
