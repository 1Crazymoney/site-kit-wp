<?php
/**
 * Has_Connected_AdminsTest
 *
 * @package   Google
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Core\Storage;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\Authentication\Clients\OAuth_Client;
use Google\Site_Kit\Core\Storage\Options;
use Google\Site_Kit\Core\Storage\User_Options;
use Google\Site_Kit\Core\Storage\Has_Connected_Admins;
use Google\Site_Kit\Tests\TestCase;
use WP_Error;

/**
 * @group Storage
 */
class Has_Connected_AdminsTest extends TestCase {

	/**
	 * @var Context
	 */
	protected $context;

	/**
	 * @var Options
	 */
	protected $options;

	/**
	 * @var User_Options
	 */
	protected $user_options;

	public function setUp() {
		parent::setUp();
		$this->context      = new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE );
		$this->options      = new Options( $this->context );
		$this->user_options = new User_Options( $this->context );
	}

	public function tearDown() {
		parent::tearDown();
		delete_option( Has_Connected_Admins::OPTION );
	}

	public function test_get__without_option_value_yet() {
		$setting = new Has_Connected_Admins( $this->options, $this->user_options );

		delete_option( Has_Connected_Admins::OPTION );
		$this->assertFalse( $setting->get() );

		$user_id = wp_insert_user(
			array(
				'user_login' => 'test_admin',
				'user_email' => 'test_admin@example.com',
				'user_pass'  => 'password',
				'role'       => 'administrator',
			)
		);

		add_user_meta(
			$user_id,
			$this->user_options->get_meta_key( OAuth_Client::OPTION_ACCESS_TOKEN ),
			'xxxxx'
		);

		delete_option( Has_Connected_Admins::OPTION );
		$this->assertTrue( $setting->get() );
		$this->assertTrue( get_option( Has_Connected_Admins::OPTION ) );

		wp_delete_user( $user_id );
	}

	public function test_get__with_option_value() {
		$setting = new Has_Connected_Admins( $this->options, $this->user_options );
		update_option( Has_Connected_Admins::OPTION, true );

		$this->assertTrue( $setting->get() );
	}

}
