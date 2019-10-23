<?php
/**
 * Data_Request
 *
 * @package   Google\Site_Kit\Core\Util
 * @copyright 2019 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\Util;

/**
 * Class Data_Request
 *
 * @package Google\Site_Kit\Core\Util
 */
class Data_Request implements \ArrayAccess {

	/**
	 * Request method.
	 *
	 * @var string
	 */
	protected $method;

	/**
	 * Request type.
	 *
	 * @var string
	 */
	protected $type;

	/**
	 * Request identifier.
	 *
	 * @var string
	 */
	protected $identifier;

	/**
	 * Request datapoint.
	 *
	 * @var string
	 */
	protected $datapoint;

	/**
	 * Request data parameters.
	 *
	 * @var array
	 */
	protected $data;

	/**
	 * Request key.
	 *
	 * @var string
	 */
	protected $key;

	/**
	 * Data_Request constructor.
	 *
	 * @param string     $method Request method.
	 * @param string     $type Request type.
	 * @param string     $identifier Request identifier.
	 * @param string     $datapoint Request datapoint.
	 * @param array|self $data Request data parameters.
	 * @param string     $key Request cache key.
	 */
	public function __construct(
		$method = null,
		$type = null,
		$identifier = null,
		$datapoint = null,
		$data = array(),
		$key = null
	) {
		$this->method     = strtoupper( $method );
		$this->type       = $type;
		$this->identifier = $identifier;
		$this->datapoint  = $datapoint;
		$this->data       = $data instanceof self ? $data->get_data() : (array) $data;
		$this->key        = $key;
	}

	/**
	 * Gets the request method.
	 *
	 * @return string
	 */
	public function get_method() {
		return $this->method;
	}

	/**
	 * Gets the request type.
	 *
	 * @return string
	 */
	public function get_type() {
		return $this->type;
	}

	/**
	 * Gets the request identifier.
	 *
	 * @return string
	 */
	public function get_identifier() {
		return $this->identifier;
	}

	/**
	 * Gets the request datapoint.
	 *
	 * @return string
	 */
	public function get_datapoint() {
		return $this->datapoint;
	}

	/**
	 * Gets the request key.
	 *
	 * @return string
	 */
	public function get_key() {
		return $this->key;
	}

	/**
	 * Gets the request data parameters.
	 *
	 * @return array
	 */
	public function get_data() {
		return (array) $this->data;
	}

	/**
	 * Checks whether the given key exists.
	 *
	 * @param string|int $key Key to check.
	 *
	 * @return bool
	 */
	public function offsetExists( $key ) {
		return array_key_exists( $key, $this->data );
	}

	/**
	 * Gets the value at the given key.
	 *
	 * @param string|int $key Key to return the value for.
	 *
	 * @return mixed
	 */
	public function offsetGet( $key ) {
		if ( $this->offsetExists( $key ) ) {
			return $this->data[ $key ];
		}

		return null;
	}

	/**
	 * Sets the given key to the given value.
	 *
	 * @param string|int $key Key to set the value for.
	 * @param mixed      $value New value for the given key.
	 */
	public function offsetSet( $key, $value ) {
		// Data is immutable.
	}

	/**
	 * Unsets the given key.
	 *
	 * @param string|int $key Key to unset.
	 */
	public function offsetUnset( $key ) {
		// Data is immutable.
	}
}
