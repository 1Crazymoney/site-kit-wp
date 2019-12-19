<?php
/**
 * Class Google\Site_Kit\Modules\AdSense\Settings
 *
 * @package   Google\Site_Kit\Modules\AdSense
 * @copyright 2019 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Modules\AdSense;

use Google\Site_Kit\Core\Storage\Setting;

/**
 * Class for AdSense settings.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class Settings extends Setting {

	const OPTION = 'googlesitekit_adsense_settings';

	/**
	 * Registers the setting in WordPress.
	 *
	 * @since n.e.x.t
	 */
	public function register() {
		register_setting(
			self::OPTION,
			self::OPTION,
			array(
				'type'              => 'object',
				'sanitize_callback' => $this->get_sanitize_callback(),
				'default'           => $this->get_default(),
			)
		);

		add_filter(
			'option_' . self::OPTION,
			function ( $option ) {
				if ( ! is_array( $option ) ) {
					$option = $this->get_default();
				}

				/**
				 * Filters the AdSense account ID to use.
				 *
				 * @since 1.0.0
				 *
				 * @param string $account_id Empty by default, will fall back to the option value if not set.
				 */
				$account_id = apply_filters( 'googlesitekit_adsense_account_id', '' );

				if ( $account_id ) {
					$option['accountID'] = $account_id;
				}

				/**
				 * Migrate 'adsenseTagEnabled' to 'useSnippet'.
				 */
				if ( ! isset( $option['useSnippet'] ) && isset( $option['adsenseTagEnabled'] ) ) {
					$option['useSnippet'] = (bool) $option['adsenseTagEnabled'];
				}
				// Ensure the old key is removed regardless. No-op if not set.
				unset( $option['adsenseTagEnabled'] );

				// Migrate `setup_complete` to `setupComplete`.
				if ( ! isset( $option['setupComplete'] ) && isset( $settings['setup_complete'] ) ) {
					$option['setupComplete'] = $option['setup_complete'];
				}
				// Ensure the old key is removed regardless. No-op if not set.
				unset( $option['setup_complete'] );

				// Fill in any missing keys with defaults.
				return $option + $this->get_default();
			}
		);
	}

	/**
	 * Gets the default value.
	 *
	 * @since n.e.x.t
	 *
	 * @return array
	 */
	public function get_default() {
		return array(
			'accountID'     => '',
			'accountStatus' => '',
			'clientID'      => '',
			'setupComplete' => false,
			'useSnippet'    => true,
		);
	}
}
