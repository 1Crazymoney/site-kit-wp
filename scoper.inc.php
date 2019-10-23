<?php
/**
 * PHP-Scoper configuration file.
 *
 * @package   Google\Site_Kit
 * @copyright 2019 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

use Isolated\Symfony\Component\Finder\Finder;

// Google API services to include classes for.
$google_services = implode(
	'|',
	array_map(
		function( $service ) {
			return preg_quote( $service, '#' );
		},
		array(
			'Analytics',
			'AnalyticsReporting',
			'AdSense',
			'Pagespeedonline',
			'PeopleService',
			'SiteVerification',
			'TagManager',
			'Webmasters',
		)
	)
);

return array(
	'prefix'                     => 'Google\\Site_Kit_Dependencies',
	'finders'                    => array(

		// General dependencies, except Google API services.
		Finder::create()
			->files()
			->ignoreVCS( true )
			->notName( '/LICENSE|.*\\.md|.*\\.dist|Makefile|composer\\.json|composer\\.lock/' )
			->exclude(
				array(
					'doc',
					'test',
					'test_old',
					'tests',
					'Tests',
					'vendor-bin',
				)
			)
			->path( '#^firebase/#' )
			->path( '#^google/apiclient/#' )
			->path( '#^google/auth/#' )
			->path( '#^guzzlehttp/#' )
			->path( '#^monolog/#' )
			->path( '#^psr/#' )
			->path( '#^ralouphie/#' )
			->path( '#^react/#' )
			->in( 'vendor' ),

		// Google API service infrastructure classes.
		Finder::create()
			->files()
			->ignoreVCS( true )
			->notName( '/LICENSE|.*\\.md|.*\\.dist|Makefile|composer\\.json|composer\\.lock/' )
			->exclude(
				array(
					'doc',
					'test',
					'test_old',
					'tests',
					'Tests',
					'vendor-bin',
				)
			)
			->path( "#^google/apiclient-services/src/Google/Service/($google_services)/#" )
			->in( 'vendor' ),

		// Google API service entry classes.
		Finder::create()
			->files()
			->ignoreVCS( true )
			->name( "#($google_services)\.php#" )
			->in( 'vendor/google/apiclient-services/src/Google/Service' ),
	),
	'files-whitelist'            => array(

		// This dependency is a global function which should remain global.
		'vendor/ralouphie/getallheaders/src/getallheaders.php',
	),
	'patchers'                   => array(
		function( $file_path, $prefix, $contents ) {
			return $contents;
		},
	),
	'whitelist'                  => array(),
	'whitelist-global-constants' => true,
	'whitelist-global-classes'   => true,
	'whitelist-global-functions' => true,
);
