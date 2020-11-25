<?php
/**
 * Class Google\Site_Kit\Core\Util\Feature_Flags
 *
 * @package   Google\Site_Kit\Core\Util
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\Util;

use ArrayAccess;

/**
 * Class handling plugin activation.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class Feature_Flags {
	/**
	 * Main instance for static access.
	 *
	 * @since n.e.x.t
	 * @var Feature_Flags
	 */
	protected static $instance;

	/**
	 * Feature flag config.
	 *
	 * @since n.e.x.t
	 * @var array|ArrayAccess
	 */
	private $config;

	/**
	 * Feature flag definitions.
	 *
	 * @since n.e.x.t
	 * @var array|ArrayAccess
	 */
	private $features;

	/**
	 * Gets the main feature flags instance.
	 *
	 * @since n.e.x.t
	 * @internal
	 *
	 * @return Feature_Flags
	 */
	public static function get_instance() {
		return static::$instance;
	}

	/**
	 * Sets the main feature flags instance.
	 *
	 * @since n.e.x.t
	 * @internal
	 *
	 * @param Feature_Flags $instance Feature_Flags instance to set as the main instance.
	 */
	public static function set_instance( Feature_Flags $instance ) {
		static::$instance = $instance;
	}

	/**
	 * Checks if the given feature is enabled in the current mode on the main instance.
	 *
	 * @since n.e.x.t
	 *
	 * @param string $feature Feature key path to check.
	 * @return bool
	 */
	public static function enabled( $feature ) {
		return static::get_instance()->is_feature_enabled( $feature );
	}

	/**
	 * Constructor.
	 *
	 * @since n.e.x.t
	 *
	 * @param array|ArrayAccess $config   Config object.
	 * @param array|ArrayAccess $features Feature flag definitions.
	 */
	public function __construct( $config = array(), $features = array() ) {
		$this->config   = $config;
		$this->features = $features;
	}

	/**
	 * Checks if the given feature is enabled in the current mode on the main instance.
	 *
	 * @since n.e.x.t
	 *
	 * @param string $feature Feature key path to check.
	 * @return bool
	 */
	public function is_feature_enabled( $feature ) {
		$feature_path  = explode( '.', $feature );
		$feature_modes = array_reduce(
			$feature_path,
			function ( $value, $key ) {
				if ( isset( $value[ $key ] ) ) {
					return $value[ $key ];
				}
				return null;
			},
			$this->features
		);

		return in_array( $this->get_mode(), (array) $feature_modes, true );
	}

	/**
	 * Gets the current feature flag mode.
	 *
	 * @since n.e.x.t
	 *
	 * @return string Current mode.
	 */
	public function get_mode() {
		$mode = ! empty( $this->config['flagMode'] ) ? $this->config['flagMode'] : 'production';

		return (string) apply_filters( 'googlesitekit_flag_mode', $mode ) ?: 'production';
	}
}
