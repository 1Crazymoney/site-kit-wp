/**
 * Cache data.
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
import { trackEvent } from './';

export async function trackAPIError( type, identifier, datapoint, error ) {
	await trackEvent(
		'api_error',
		`${ type }/${ identifier }/data/${ datapoint }`,
		`${ error.message } (code: ${ error.code }${ error.data?.reason ? ', reason: ' + error.data.reason : '' } ])`,
		error.data?.status || error.code
	);
}
