<?php
/**
 * Setting_With_Owned_Keys_ContractTests
 *
 * @package   Google\Site_Kit\Tests\Core\Storage
 * @copyright 2019 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Core\Storage;

use Google\Site_Kit\Core\Storage\Setting_With_Owned_Keys_Interface;
use Google\Site_Kit\Tests\TestCase_Context_Trait;

trait Setting_With_Owned_Keys_ContractTests {

	use TestCase_Context_Trait;

	/**
	 * @return Setting_With_Owned_Keys_Interface
	 */
	abstract protected function get_setting_with_owned_keys();

	public function test_owner_id_is_set() {
		$testcase    = $this->get_testcase();
		$options_key = $this->get_option_name();

		$settings = $this->get_setting_with_owned_keys();
		$settings->register();

		$user_id = $this->factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $user_id );

		$fields = $settings->get_owned_keys();
		foreach ( $fields as $field ) {
			delete_option( $options_key );

			$options = $settings->get();
			$this->assertTrue( empty( $options['ownerID'] ) );

			$options[ $field ] = 'test-value';
			$settings->set( $options );

			$options = get_option( $options_key );
			$this->assertEquals( $user_id, $options['ownerID'] );
		}
	}

	public function test_owner_id_is_not_set() {
		$testcase    = $this->get_testcase();
		$options_key = $this->get_option_name();

		$settings = $this->get_setting_with_owned_keys();
		$settings->register();

		$user_id = $this->factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $user_id );

		add_option(
			$options_key,
			array(
				'not-owned-key' => 'old-value',
			)
		);

		$options = $settings->get();
		$this->assertTrue( empty( $options['ownerID'] ) );

		$options['not-owned-key'] = 'new-value';
		$settings->set( $options );

		$options = get_option( $options_key );
		$this->assertNotEquals( $user_id, $options['ownerID'] );
	}

}
