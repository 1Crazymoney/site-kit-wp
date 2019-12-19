<?php
/**
 * Class Google\Site_Kit\Core\Storage
 *
 * @package   Google\Site_Kit\Core\Storage
 * @copyright 2019 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\Storage;

/**
 * Base class for a single setting.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
abstract class Setting {

	/**
	 * The option_name for this setting.
	 * Override in a sub-class.
	 */
	const OPTION = '';

	/**
	 * Options instance.
	 *
	 * @since n.e.x.t
	 * @var Options
	 */
	protected $options;

	/**
	 * Setting constructor.
	 *
	 * @since n.e.x.t
	 *
	 * @param Options $options Options instance.
	 */
	public function __construct( Options $options ) {
		$this->options = $options;
	}

	/**
	 * Registers the setting in WordPress.
	 *
	 * @since n.e.x.t
	 *
	 * @return mixed
	 */
	abstract public function register();

	/**
	 * Checks whether or not the option is set with a valid value.
	 *
	 * @since n.e.x.t
	 *
	 * @return bool True on success, false on failure.
	 */
	public function has() {
		return (bool) $this->get();
	}

	/**
	 * Gets the value of the setting.
	 *
	 * @since n.e.x.t
	 *
	 * @return mixed Value set for the option, or registered default if not set.
	 */
	public function get() {
		return $this->options->get( static::OPTION );
	}

	/**
	 * Sets the value of the setting with the given value.
	 *
	 * @since n.e.x.t
	 *
	 * @param mixed $value Setting value. Must be serializable if non-scalar.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function set( $value ) {
		return $this->options->set( static::OPTION, $value );
	}

	/**
	 * Deletes the setting.
	 *
	 * @since n.e.x.t
	 *
	 * @return bool True on success, false on failure.
	 */
	public function delete() {
		return $this->options->delete( static::OPTION );
	}
}
