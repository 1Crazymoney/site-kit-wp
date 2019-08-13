
import { wpApiFetch } from './wp-api-fetch';

/**
 *
 * @param {*} config
 */
export async function setAuthToken( token = 'test-access-token' ) {
	return await wpApiFetch( {
		path: 'google-site-kit/v1/e2e/auth/access-token',
		method: 'post',
		data: { token },
	} );
}
