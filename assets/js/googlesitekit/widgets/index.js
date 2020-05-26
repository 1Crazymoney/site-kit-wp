/**
 * Widgets API
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
import { dispatch, select } from 'googlesitekit-data';
import { STORE_NAME } from './datastore/constants';
// This import has side-effects; it registers the Widgets datastore on the default
// data store registry (eg. `googlesitekit.data`).
import './datastore';

const Widgets = {
	/**
	 * Register a widget area
	 *
	 * @since n.e.x.t
	 * @param {string}             slug                Widget Area's slug.
	 * @param {Object}             settings            Widget Area's settings.
	 * @param {string}             settings.title      Title for this widget area.
	 * @param {string}             settings.subtitle   Subtitle for this widget area.
	 * @param {number}             [settings.priority] Priority for this widget area. Default: 10.
	 * @param {(string|undefined)} [settings.icon]     URL to SVG icon for this widget area.
	 * @param {string}             [settings.style]    Widget area style (one of "boxes", "composite").
	 * @param {(string|Array)}     [areaSlugs]         Optional. Widget area slug(s).
	 */
	registerWidgetArea( slug, settings, areaSlugs ) {
		dispatch( STORE_NAME ).registerWidgetArea( slug, settings );
		if ( areaSlugs ) {
			dispatch( STORE_NAME ).assignWidget( slug, areaSlugs );
		}
	},

	/**
	 * Register a widget.
	 *
	 * @since n.e.x.t
	 * @param {string}         slug           Widget's slug.
	 * @param {Object}         settings       Widget's settings.
	 * @param {(string|Array)} [contextSlugs] Widget context's slug(s).
	 */
	registerWidget( slug, settings, contextSlugs ) {
		dispatch( STORE_NAME ).registerWidget( slug, settings );
		if ( contextSlugs ) {
			dispatch( STORE_NAME ).assignWidgetArea( slug, contextSlugs );
		}
	},

	/**
	 * Assigns a widget area to one (or several) contexts.
	 *
	 * Accepts an area slug to register as the first argument, then either a string
	 * (for a single context slug) or array of contexts slugs (to assign the widget area
	 * to multiple contexts).
	 *
	 * @since n.e.x.t
	 * @param {string}         slug          Widget Area's slug.
	 * @param {(string|Array)} contextSlugs  Widget Context's slug(s).
	 */
	assignWidgetArea( slug, contextSlugs ) {
		dispatch( STORE_NAME ).assignWidgetArea( slug, contextSlugs );
	},

	/**
	 * Assigns an existing widget (by slug) to a widget area(s).
	 *
	 * @since n.e.x.t
	 *
	 * @param  {string}         slug            Widget slug.
	 * @param  {(string|Array)} widgetAreaSlugs Widget Area slug(s).
	 */
	assignWidget( slug, widgetAreaSlugs ) {
		dispatch( STORE_NAME ).assignWidget( slug, widgetAreaSlugs );
	},

	/**
	 * Checks if a widget area has been registered.
	 *
	 * Returns `true` if the widget area has been registered.
	 * Returns `false` if the widget area has NOT been registered.
	 *
	 * @since n.e.x.t
	 *
	 * @param  {string} slug Widget Area's slug.
	 *
	 * @return {boolean} `true`/`false` based on whether widget area has been registered.
	 */
	isWidgetAreaRegistered( slug ) {
		return select( STORE_NAME ).isWidgetAreaRegistered( slug );
	},

	/**
	 * Checks if a widget has been registered with a given slug.
	 *
	 * Returns `true` if the widget area has been registered.
	 * Returns `false` if the widget area has NOT been registered.
	 *
	 * @since n.e.x.t
	 *
	 * @param  {string}  slug  Widget's slug.
	 *
	 * @return {boolean}       `true`/`false` based on whether widget has been registered.
	 */
	isWidgetRegistered( slug ) {
		return select( STORE_NAME ).isWidgetRegistered( slug );
	},
};

export default Widgets;
