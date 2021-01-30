/**
 * Admin Bar Component Stories.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
import { storiesOf } from '@storybook/react';

/**
 * Internal dependencies
 */
import { GoogleSitekitAdminbar } from '../assets/js/googlesitekit-adminbar';
import { googlesitekit as wpAdminBarData } from '../.storybook/data/blog---googlesitekit';
import { CORE_USER } from '../assets/js/googlesitekit/datastore/user/constants';
import { provideModules, provideSiteInfo, WithTestRegistry } from '../tests/js/utils';
import { STORE_NAME as MODULES_SEARCH_CONSOLE } from '../assets/js/modules/search-console/datastore/constants';
import { STORE_NAME as MODULES_ANALYTICS } from '../assets/js/modules/analytics/datastore/constants';

storiesOf( 'Global', module )
	.add( 'Admin Bar', () => {
		global._googlesitekitLegacyData = wpAdminBarData;

		const setupRegistry = ( registry ) => {
			// Set the Story site information.
			provideSiteInfo( registry, {
				currentEntityURL: 'https://www.sitekitbygoogle.com/blog/',
				currentEntityTitle: 'Blog test post for Google Site Kit',
			} );

			// Set up the search console and analytics modules stores but provide no data.
			provideModules( registry, [
				{ slug: 'search-console', active: true, connected: true },
				{ slug: 'analytics', active: true, connected: true },
			] );

			registry.dispatch( CORE_USER ).setReferenceDate( '2021-01-28' );

			// Search Console mock data
			const searchConsoleData = [
				{
					clicks: 1,
					ctr: 0.019230769230769232,
					impressions: 52,
					keys: [
						'2020-12-03',
					],
					position: 2.5576923076923075,
				},
				{
					clicks: 1,
					ctr: 0.024390243902439025,
					impressions: 41,
					keys: [
						'2020-12-04',
					],
					position: 2.4878048780487805,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 16,
					keys: [
						'2020-12-05',
					],
					position: 3.6875,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 27,
					keys: [
						'2020-12-06',
					],
					position: 2.7407407407407405,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 53,
					keys: [
						'2020-12-07',
					],
					position: 2.9433962264150946,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 45,
					keys: [
						'2020-12-08',
					],
					position: 2.3555555555555556,
				},
				{
					clicks: 2,
					ctr: 0.02531645569620253,
					impressions: 79,
					keys: [
						'2020-12-09',
					],
					position: 2.6835443037974684,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 54,
					keys: [
						'2020-12-10',
					],
					position: 2.537037037037037,
				},
				{
					clicks: 1,
					ctr: 0.027777777777777776,
					impressions: 36,
					keys: [
						'2020-12-11',
					],
					position: 2.611111111111111,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 14,
					keys: [
						'2020-12-12',
					],
					position: 3.2857142857142856,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 24,
					keys: [
						'2020-12-13',
					],
					position: 3,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 54,
					keys: [
						'2020-12-14',
					],
					position: 2.5740740740740744,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 41,
					keys: [
						'2020-12-15',
					],
					position: 2.5365853658536586,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 38,
					keys: [
						'2020-12-16',
					],
					position: 2.1842105263157894,
				},
				{
					clicks: 2,
					ctr: 0.05714285714285714,
					impressions: 35,
					keys: [
						'2020-12-17',
					],
					position: 2.0857142857142854,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 18,
					keys: [
						'2020-12-18',
					],
					position: 3.1666666666666665,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 13,
					keys: [
						'2020-12-19',
					],
					position: 2.1538461538461537,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 12,
					keys: [
						'2020-12-20',
					],
					position: 2.5,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 30,
					keys: [
						'2020-12-21',
					],
					position: 2.6333333333333333,
				},
				{
					clicks: 1,
					ctr: 0.03225806451612903,
					impressions: 31,
					keys: [
						'2020-12-22',
					],
					position: 2.258064516129032,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 27,
					keys: [
						'2020-12-23',
					],
					position: 2.5925925925925926,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 19,
					keys: [
						'2020-12-24',
					],
					position: 2.5789473684210527,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 7,
					keys: [
						'2020-12-25',
					],
					position: 2.2857142857142856,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 13,
					keys: [
						'2020-12-26',
					],
					position: 2.0769230769230766,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 12,
					keys: [
						'2020-12-27',
					],
					position: 2.166666666666667,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 28,
					keys: [
						'2020-12-28',
					],
					position: 2.607142857142857,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 40,
					keys: [
						'2020-12-29',
					],
					position: 2.75,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 42,
					keys: [
						'2020-12-30',
					],
					position: 7.357142857142857,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 14,
					keys: [
						'2020-12-31',
					],
					position: 2.2857142857142856,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 14,
					keys: [
						'2021-01-01',
					],
					position: 3,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 28,
					keys: [
						'2021-01-02',
					],
					position: 2.2142857142857144,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 23,
					keys: [
						'2021-01-03',
					],
					position: 2.782608695652174,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 53,
					keys: [
						'2021-01-04',
					],
					position: 2.452830188679245,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 42,
					keys: [
						'2021-01-05',
					],
					position: 2.5476190476190474,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 35,
					keys: [
						'2021-01-06',
					],
					position: 2.314285714285714,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 44,
					keys: [
						'2021-01-07',
					],
					position: 3.340909090909091,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 48,
					keys: [
						'2021-01-08',
					],
					position: 3.3541666666666665,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 18,
					keys: [
						'2021-01-09',
					],
					position: 2.5,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 16,
					keys: [
						'2021-01-10',
					],
					position: 3.375,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 38,
					keys: [
						'2021-01-11',
					],
					position: 2.1578947368421053,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 40,
					keys: [
						'2021-01-12',
					],
					position: 2.725,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 76,
					keys: [
						'2021-01-13',
					],
					position: 2.6578947368421053,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 64,
					keys: [
						'2021-01-14',
					],
					position: 2.625,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 33,
					keys: [
						'2021-01-15',
					],
					position: 2.606060606060606,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 49,
					keys: [
						'2021-01-16',
					],
					position: 2.63265306122449,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 21,
					keys: [
						'2021-01-17',
					],
					position: 2.4761904761904763,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 50,
					keys: [
						'2021-01-18',
					],
					position: 2.62,
				},
				{
					clicks: 2,
					ctr: 0.03571428571428571,
					impressions: 56,
					keys: [
						'2021-01-19',
					],
					position: 4,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 52,
					keys: [
						'2021-01-20',
					],
					position: 2.6346153846153846,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 63,
					keys: [
						'2021-01-21',
					],
					position: 2.4603174603174605,
				},
				{
					clicks: 1,
					ctr: 0.02040816326530612,
					impressions: 49,
					keys: [
						'2021-01-22',
					],
					position: 2.2653061224489797,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 15,
					keys: [
						'2021-01-23',
					],
					position: 2.7333333333333334,
				},
				{
					clicks: 1,
					ctr: 0.03571428571428571,
					impressions: 28,
					keys: [
						'2021-01-24',
					],
					position: 2.571428571428571,
				},
				{
					clicks: 2,
					ctr: 0.04,
					impressions: 50,
					keys: [
						'2021-01-25',
					],
					position: 5.84,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 56,
					keys: [
						'2021-01-26',
					],
					position: 8.303571428571429,
				},
				{
					clicks: 0,
					ctr: 0,
					impressions: 39,
					keys: [
						'2021-01-27',
					],
					position: 2.564102564102564,
				},
			];
			const searchConsoleOptions = {
				startDate: '2020-12-03',
				endDate: '2021-01-27',
				dimensions: 'date',
				url: 'https://www.sitekitbygoogle.com/blog/',
			};

			registry.dispatch( MODULES_SEARCH_CONSOLE ).receiveGetReport( searchConsoleData, { options: searchConsoleOptions } );

			// Mock Analytics mock data separately for each section
			// Total Users
			const analyticsTotalUsersData = [
				{
					nextPageToken: null,
					columnHeader: {
						dimensions: null,
						metricHeader: {
							metricHeaderEntries: [
								{
									name: 'Total Users',
									type: 'INTEGER',
								},
							],
						},
					},
					data: {
						dataLastRefreshed: null,
						isDataGolden: null,
						rowCount: 1,
						samplesReadCounts: null,
						samplingSpaceSizes: null,
						rows: [
							{
								dimensions: null,
								metrics: [
									{
										values: [
											'246',
										],
									},
									{
										values: [
											'214',
										],
									},
								],
							},
						],
						totals: [
							{
								values: [
									'246',
								],
							},
							{
								values: [
									'214',
								],
							},
						],
						minimums: [
							{
								values: [
									'246',
								],
							},
							{
								values: [
									'214',
								],
							},
						],
						maximums: [
							{
								values: [
									'246',
								],
							},
							{
								values: [
									'214',
								],
							},
						],
					},
				},
			];

			const analyticsTotalUsersOptions = {
				startDate: '2020-12-31',
				endDate: '2021-01-27',
				compareStartDate: '2020-12-03',
				compareEndDate: '2020-12-30',
				metrics: [
					{
						expression: 'ga:users',
						alias: 'Total Users',
					},
				],
				url: 'https://www.sitekitbygoogle.com/blog/',
			};

			registry.dispatch( MODULES_ANALYTICS ).receiveGetReport( analyticsTotalUsersData, { options: analyticsTotalUsersOptions } );

			// Sessions
			const analyticsSessionsData = [
				{
					nextPageToken: '10',
					columnHeader: {
						dimensions: [
							'ga:date',
						],
						metricHeader: {
							metricHeaderEntries: [
								{
									name: 'Sessions',
									type: 'INTEGER',
								},
							],
						},
					},
					data: {
						dataLastRefreshed: null,
						isDataGolden: null,
						rowCount: 56,
						samplesReadCounts: null,
						samplingSpaceSizes: null,
						rows: [
							{
								dimensions: [
									'20201203',
								],
								metrics: [
									{
										values: [
											'0',
										],
									},
									{
										values: [
											'4',
										],
									},
								],
							},
							{
								dimensions: [
									'20201204',
								],
								metrics: [
									{
										values: [
											'0',
										],
									},
									{
										values: [
											'2',
										],
									},
								],
							},
							{
								dimensions: [
									'20201205',
								],
								metrics: [
									{
										values: [
											'0',
										],
									},
									{
										values: [
											'0',
										],
									},
								],
							},
							{
								dimensions: [
									'20201206',
								],
								metrics: [
									{
										values: [
											'0',
										],
									},
									{
										values: [
											'0',
										],
									},
								],
							},
							{
								dimensions: [
									'20201207',
								],
								metrics: [
									{
										values: [
											'0',
										],
									},
									{
										values: [
											'0',
										],
									},
								],
							},
							{
								dimensions: [
									'20201208',
								],
								metrics: [
									{
										values: [
											'0',
										],
									},
									{
										values: [
											'1',
										],
									},
								],
							},
							{
								dimensions: [
									'20201209',
								],
								metrics: [
									{
										values: [
											'0',
										],
									},
									{
										values: [
											'3',
										],
									},
								],
							},
							{
								dimensions: [
									'20201210',
								],
								metrics: [
									{
										values: [
											'0',
										],
									},
									{
										values: [
											'0',
										],
									},
								],
							},
							{
								dimensions: [
									'20201211',
								],
								metrics: [
									{
										values: [
											'0',
										],
									},
									{
										values: [
											'4',
										],
									},
								],
							},
							{
								dimensions: [
									'20201212',
								],
								metrics: [
									{
										values: [
											'0',
										],
									},
									{
										values: [
											'1',
										],
									},
								],
							},
						],
						totals: [
							{
								values: [
									'29',
								],
							},
							{
								values: [
									'35',
								],
							},
						],
						minimums: [
							{
								values: [
									'0',
								],
							},
							{
								values: [
									'0',
								],
							},
						],
						maximums: [
							{
								values: [
									'4',
								],
							},
							{
								values: [
									'6',
								],
							},
						],
					},
				},
			];

			const analyticsSessionsOptions = {
				startDate: '2020-12-31',
				endDate: '2021-01-27',
				compareStartDate: '2020-12-03',
				compareEndDate: '2020-12-30',
				dimensions: 'ga:date',
				limit: 10,
				metrics: [
					{
						expression: 'ga:sessions',
						alias: 'Sessions',
					},
				],
				url: 'https://www.sitekitbygoogle.com/blog/',
			};

			registry.dispatch( MODULES_ANALYTICS ).receiveGetReport( analyticsSessionsData, { options: analyticsSessionsOptions } );
		};

		return (
			<div id="wpadminbar">
				<div className="googlesitekit-plugin">
					<div id="js-googlesitekit-adminbar" className="ab-sub-wrapper googlesitekit-adminbar" style={ { display: 'block' } }>
						<section id="js-googlesitekit-adminbar-modules" className="googlesitekit-adminbar-modules">
							<WithTestRegistry callback={ setupRegistry }>
								<GoogleSitekitAdminbar />
							</WithTestRegistry>
						</section>
					</div>
				</div>
			</div>
		);
	} );
