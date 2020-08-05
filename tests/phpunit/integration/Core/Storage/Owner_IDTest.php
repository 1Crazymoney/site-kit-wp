<?php
/**
 * Class Google\Site_Kit\Core\Storage\Owner_IDTest
 *
 * @package   Google\Site_Kit
 * @copyright 2019 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Core\Storage;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\Storage\Owner_ID;
use Google\Site_Kit\Core\Storage\Options;
use Google\Site_Kit\Tests\TestCase;

/**
 * Owner_IDTest
 *
 * @group Storage
 */
class Owner_IDTest extends TestCase {

	/**
	 * Owner_ID object.
	 *
	 * @var Owner_ID
	 */
	private $owner_id;

	/**
	 * Set Up Test.
	 */
	public function setUp() {
		parent::setUp();

		$options        = new Options( new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE ) );
		$this->owner_id = new Owner_ID( $options );
	}

	/**
	 * Test get() method.
	 */
	public function test_get() {
		$this->assertFalse( $this->owner_id->get() );

		$this->owner_id->set( 1 );
		$this->assertEquals( 1, $this->owner_id->get() );
	}

	/**
	 * Test set() method.
	 */
	public function test_set() {
		$this->assertTrue( $this->owner_id->set( 1 ) );
		$this->assertEquals( 1, $this->owner_id->get() );
	}

	/**
	 * Test has() method.
	 */
	public function test_has() {
		$this->assertFalse( $this->owner_id->has() );

		$this->owner_id->set( 1 );
		$this->assertTrue( $this->owner_id->has() );
	}
}
