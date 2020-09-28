/**
 * ESLint rules: specify JSDoc tag grouping rules.
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
const { default: iterateJsdoc } = require( 'eslint-plugin-jsdoc/dist/iterateJsdoc' );

module.exports = iterateJsdoc( ( {
	context,
	jsdoc,
	jsdocNode,
	utils,
} ) => {
	if ( ! jsdoc.tags || ! jsdoc.tags.length ) {
		return;
	}

	// eslint-disable-next-line no-nested-ternary
	const lastTagInFirstGroup = !! utils.filterTags( ( { tag } ) => {
		return [ 'private' ].includes( tag );
	} ).length ? 'private' : ( !! utils.filterTags( ( { tag } ) => {
			return [ 'deprecated' ].includes( tag );
		} ).length ? 'deprecated' : 'since' );

	const firstTagInSecondGroup = !! utils.filterTags( ( { tag } ) => {
		return [ 'param' ].includes( tag );
	} ).length ? 'param' : 'return';

	if ( ! jsdoc.source.match( new RegExp( `@${ lastTagInFirstGroup }.*\\n\\n@${ firstTagInSecondGroup }`, 'gm' ) ) ) {
		context.report( { node: jsdocNode, message: `The @${ lastTagInFirstGroup } tag should be followed by an empty line, and then by the @${ firstTagInSecondGroup } tag.`, data: { name: jsdocNode.name } } );
	}
}, {
	iterateAllJsdocs: true,
	meta: {
		docs: {
			description: 'Requires that all functions have properly sorted doc annotations.',
		},
		fixable: 'code',
		type: 'suggestion',
	},
} );
