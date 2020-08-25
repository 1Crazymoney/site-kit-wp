<?php
/**
 * Trait Google\Site_Kit\Core\Storage\Setting_With_Owned_Keys_Trait
 *
 * @package   Google\Site_Kit\Core\Storage
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\Storage;

/**
 * Trait for a Setting that has owner ID option key.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
trait Setting_With_Owned_Keys_Trait {

	/**
	 * Registers hooks to determine an owner ID for a module.
	 *
	 * @since n.e.x.t
	 *
	 * @param array  $keys An array of keys to check.
	 * @param string $ownerID_key Optional. A key to use for storing owner ID setting.
	 */
	protected function register_owned_keys( array $keys, $ownerID_key = 'ownerID' ) { // phpcs:ignore WordPress.NamingConventions.ValidVariableName.VariableNotSnakeCase
		add_action(
			'add_option_' . static::OPTION,
			function ( $option, $value ) use ( $keys, $ownerID_key ) { // phpcs:ignore WordPress.NamingConventions.ValidVariableName.VariableNotSnakeCase
				if ( is_array( $value ) && count( array_intersect( array_keys( $value ), $keys ) ) > 0 ) {
					$this->merge( array( $ownerID_key => get_current_user_id() ) ); // phpcs:ignore WordPress.NamingConventions.ValidVariableName.VariableNotSnakeCase
				}
			},
			10,
			2
		);

		add_filter(
			'pre_update_option_' . static::OPTION,
			function( $value, $old_value ) use ( $keys, $ownerID_key ) { // phpcs:ignore WordPress.NamingConventions.ValidVariableName.VariableNotSnakeCase
				if ( is_array( $value ) && is_array( $old_value ) ) {
					foreach ( $keys as $key ) {
						if ( isset( $value[ $key ], $old_value[ $key ] ) && $value[ $key ] !== $old_value[ $key ] ) {
							$value[ $ownerID_key ] = get_current_user_id(); // phpcs:ignore WordPress.NamingConventions.ValidVariableName.VariableNotSnakeCase
							break;
						}
					}
				}

				return $value;
			},
			10,
			2
		);
	}

}
