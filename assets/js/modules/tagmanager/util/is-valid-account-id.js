/**
 * Checks if the given account ID appears to be a valid GTM account.
 *
 * @since 1.3.0
 *
 * @param {(string|number)} accountID Account ID to test.
 * @return {boolean} Whether or not the given account ID is valid.
 */
export default function isValidAccountID( accountID ) {
	const accountInt = parseInt( accountID, 10 ) || 0;

	return accountInt > 0;
}
