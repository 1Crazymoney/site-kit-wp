<?php
/**
 * Verification_MetaTest
 *
 * @package   Google\Site_Kit\Tests\Core\Authentication
 * @copyright 2019 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Core\Authentication;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\Authentication\Verification_Meta;
use Google\Site_Kit\Core\Storage\Transients;
use Google\Site_Kit\Core\Storage\User_Options;
use Google\Site_Kit\Tests\TestCase;

/**
 * @group Authentication
 */
class Verification_MetaTest extends TestCase {

	public function test_get() {
		$user_id      = $this->factory()->user->create();
		$context      = new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE );
		$user_options = new User_Options( $context, $user_id );
		$transients   = new Transients( $context );

		$verification_meta = new Verification_Meta( $user_options, $transients );

		$this->assertFalse( $user_options->get( Verification_Meta::OPTION ) );
		$this->assertFalse( $verification_meta->get() );
		$user_options->set( Verification_Meta::OPTION, 'test-verification-tag' );
		$this->assertEquals( 'test-verification-tag', $verification_meta->get() );
	}

	public function test_set() {
		$user_id      = $this->factory()->user->create();
		$context      = new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE );
		$user_options = new User_Options( $context, $user_id );
		$transients   = new Transients( $context );

		$transients->set( 'googlesitekit_verification_meta_tags', 'test-verification-meta-tags' );
		$verification_meta = new Verification_Meta( $user_options, $transients );

		$this->assertEquals( 'test-verification-meta-tags', get_transient( 'googlesitekit_verification_meta_tags' ) );
		$this->assertTrue( $verification_meta->set( 'test-verification-tag' ) );
		$this->assertEquals( 'test-verification-tag', $user_options->get( Verification_Meta::OPTION ) );
		$this->assertFalse( get_transient( 'googlesitekit_verification_meta_tags' ) );

		// Test transient is only deleted when option is successfully updated.
		// User_Options->set() will return false if new value === old value.
		$transients->set( 'googlesitekit_verification_meta_tags', 'test-verification-meta-tags' );
		$this->assertEquals( 'test-verification-meta-tags', get_transient( 'googlesitekit_verification_meta_tags' ) );
		$this->assertFalse( $verification_meta->set( 'test-verification-tag' ) );
		$this->assertEquals( 'test-verification-meta-tags', get_transient( 'googlesitekit_verification_meta_tags' ) );
	}

	public function test_has() {
		$user_id      = $this->factory()->user->create();
		$context      = new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE );
		$user_options = new User_Options( $context, $user_id );
		$transients   = new Transients( $context );

		$verification_meta = new Verification_Meta( $user_options, $transients );

		$this->assertFalse( $verification_meta->has() );
		$user_options->set( Verification_Meta::OPTION, 'test-verification-tag' );
		$this->assertTrue( $verification_meta->has() );
	}

	public function test_get_all() {
		$user_id      = $this->factory()->user->create();
		$context      = new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE );
		$user_options = new User_Options( $context, $user_id );
		$transients   = new Transients( $context );

		$verification_meta = new Verification_Meta( $user_options, $transients );

		// Always returns an array
		$transients->set( 'googlesitekit_verification_meta_tags', 'test-meta-tags' );
		$this->assertEquals( array( 'test-meta-tags' ), $verification_meta->get_all() );

		update_user_option( 99, Verification_Meta::OPTION, 'verification-tag-99', $context->is_network_mode() );
		update_user_option( 98, Verification_Meta::OPTION, 'verification-tag-98', $context->is_network_mode() );
		update_user_option( 97, Verification_Meta::OPTION, 'verification-tag-97', $context->is_network_mode() );

		$this->assertEquals( array( 'test-meta-tags' ), $verification_meta->get_all() );
		$transients->delete( 'googlesitekit_verification_meta_tags' );
		// If the transient is not set, it will regenerate it when get_all is called
		$all_tags = array(
			'verification-tag-98',
			'verification-tag-99',
			'verification-tag-97',
		);
		$this->assertEqualSets(
			$all_tags,
			$verification_meta->get_all()
		);
		$this->assertEqualSets(
			$all_tags,
			$transients->get( 'googlesitekit_verification_meta_tags' )
		);
	}
}
