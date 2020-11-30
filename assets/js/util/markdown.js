/**
 * Markdown utility.
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
 * Replaces markdown links with its HTML equivalents.
 *
 * @since n.e.x.t
 *
 * @param {string} text Markdown text.
 * @return {string} Text with HTML links.
 */
function markdownLinks( text ) {
	return text.replace(
		/\[([^\]]+)\]\((https?:\/\/[^\/]+\.\w+\/?.*?)\)/ig,
		'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
	);
}

/**
 * Converts markdown to HTML.
 *
 * @since n.e.x.t
 *
 * @param {string} text Markdown text.
 * @return {string} HTML version of the markdown text.
 */
export function markdownToHTML( text ) {
	const rules = [
		markdownLinks,
	];

	let html = text;
	for ( const rule of rules ) {
		html = rule( html );
	}

	return html;
}
