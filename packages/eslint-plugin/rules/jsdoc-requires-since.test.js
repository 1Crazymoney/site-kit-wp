/**
 * ESLint rules: since tag tests.
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
import { RuleTester } from 'eslint';

/**
 * Internal dependencies
 */
import rule from './jsdoc-requires-since';

const ruleTester = new RuleTester( {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 6,
	},
} );

ruleTester.run( 'jsdoc-requires-since', rule, {
	valid: [
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.1
 */
      `,
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.1
 * @since 1.8.0 Added a feature.
 * @since n.e.x.t Added another feature.
 */
      `,
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.1
 * @since 1.8.0 Added a feature.
 * @since 1.9.1 Added another feature.
 */
      `,
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.1 Originally introduced.
 * @since 1.8.0 Added a feature.
 * @since 1.9.1 Added another feature.
 */
      `,
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.1 Originally introduced.
 * @since 1.8.0 Added a feature.
 * @since n.e.x.t Added another feature.
 */
      `,
		},
	],
	invalid: [
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.0
 * @since 1.7.1
 */
      `,
			errors: [
				{
					message:
						'All @since tags after the first require a description.',
				},
			],
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.0
 * @since 1.7.1
 */
      `,
			errors: [
				{
					message:
						'All @since tags after the first require a description.',
				},
			],
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.6.0
 * @since 1.7.0
 * @since 1.7.1 Add a feature.
 */
      `,
			errors: [
				{
					message:
						'All @since tags after the first require a description.',
				},
			],
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.1 Missing a full-stop
 */
      `,
			errors: [
				{
					message:
						'All @since tags should have a description that ends with a period/full-stop.',
				},
			],
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.1
 * @since 1.7.2 Missing a full-stop
 */
      `,
			errors: [
				{
					message:
						'All @since tags should have a description that ends with a period/full-stop.',
				},
			],
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.1
 * @since 1.7.2 lowercase description.
 */
      `,
			errors: [
				{
					message:
						'All @since tags should have a description starting with a capital letter.',
				},
			],
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.1 lowercase description.
 * @since 1.7.2 Normal description.
 */
      `,
			errors: [
				{
					message:
						'All @since tags should have a description starting with a capital letter.',
				},
			],
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.2 Another description.
 * @since 1.7.1 Normal description.
 */
      `,
			errors: [
				{
					message:
						'@since tags should appear in order of version number.',
				},
			],
		},
		{
			code: `
/**
 * A function that returns a string, to test out ESLint.
 *
 * @since 1.7.1 Normal description.
 * @since 1.7.1 Another description.
 */
      `,
			errors: [
				{
					message:
						'Each version should have only one @since tag.',
				},
			],
		},
		{
			code: `
/**
 * An object.
 *
 * @since 1.0.0 Bar.
 * @since 1.2.0 \`F\`
 */
      `,
			errors: [
				{
					message:
						'All @since tags should have a description that ends with a period/full-stop.',
				},
			],
		},
	],
} );
