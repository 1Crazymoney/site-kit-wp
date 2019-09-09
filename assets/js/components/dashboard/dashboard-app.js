/**
 * DashboardApp component.
 *
 * Site Kit by Google, Copyright 2019 Google LLC
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
import Header from 'GoogleComponents/header';
import DateRangeSelector from 'GoogleComponents/date-range-selector';
import PageHeader from 'GoogleComponents/page-header';
import 'GoogleComponents/publisher-wins';
import 'GoogleComponents/notifications';

/**
 * Internal dependencies
 */
import DashboardMain from './dashboard-main';
import DashboardNotifications from './dashboard-notifications';

const { Component, Fragment } = wp.element;
const { __ } = wp.i18n;

class DashboardApp extends Component {
	render() {
		return (
			<Fragment>
				<Header />
				<DashboardNotifications />
				<div className="googlesitekit-module-page">
					<div className="mdc-layout-grid">
						<div className="mdc-layout-grid__inner">
							<div className="
								mdc-layout-grid__cell
								mdc-layout-grid__cell--span-10-desktop mdc-layout-grid__cell--span-6-tablet mdc-layout-grid__cell--span-2-phone
							">
								<PageHeader
									title={ __( 'Site Overview', 'google-site-kit' ) }
								/>
							</div>
							<div className="
									mdc-layout-grid__cell
									mdc-layout-grid__cell--span-2-desktop mdc-layout-grid__cell--span-2-tablet mdc-layout-grid__cell--span-2-phone mdc-layout-grid__cell--align-middle mdc-layout-grid__cell--align-right
							">
								<DateRangeSelector />
							</div>
							<DashboardMain />
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default DashboardApp;
