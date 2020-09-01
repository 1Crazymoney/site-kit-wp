<?php
/**
 * Class Google\Site_Kit\Core\Util\WP_Query_Factory
 *
 * @package   Google\Site_Kit
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\Util;

use WP_Query;

/**
 * Class creating `WP_Query` instances.
 *
 * @since 1.15.0
 * @access private
 * @ignore
 */
final class WP_Query_Factory {

	/**
	 * Creates a `WP_Query` instance to use for a given URL.
	 *
	 * The `WP_Query` instance returned is initialized with the correct query arguments, but the actual query will not
	 * have run yet. The {@see WP_Query_Factory::run_query()} method should be used to do that.
	 *
	 * This is an expensive function that works similarly to WordPress core's `url_to_postid()` function, however also
	 * covering non-post URLs. It follows logic used in `WP::parse_request()` to cover the other kinds of URLs. The
	 * majority of the code is a direct copy of certain parts of these functions.
	 *
	 * @since 1.15.0
	 *
	 * @param string $url URL to get WordPress query object for.
	 * @return WP_Query|null WordPress query instance, or null if unable to parse query from URL.
	 */
	public static function from_url( $url ) {
		$url = self::normalize_url( $url );
		if ( empty( $url ) ) {
			return null;
		}

		$url_path_vars  = self::get_url_path_vars( $url );
		$url_query_vars = self::get_url_query_vars( $url );

		$query_args = self::parse_wp_query_args( $url_path_vars, $url_query_vars );

		$restore_context = WP_Context_Switcher::with_frontend_context();

		$query = new WP_Query();
		$query->parse_query( $query_args );

		$restore_context();

		return $query;
	}

	/**
	 * Runs the query for the given `WP_Query` instance.
	 *
	 * This method should be used in favor of calling `WP_Query::get_posts()` on custom `WP_Query` instances, to ensure
	 * that supplemental logic such as detecting a 404 state is run as well.
	 *
	 * The majority of the code is a copy of `WP::handle_404()`.
	 *
	 * @since n.e.x.t
	 *
	 * @param WP_Query $query WordPress query instance to run the query on.
	 */
	public static function run_query( WP_Query $query ) {
		$restore_context = WP_Context_Switcher::with_frontend_context();

		$query->get_posts();

		$restore_context();

		// Check if this is a single paginated post query.
		if ( $query->posts && $query->is_singular() && $query->post && ! empty( $query->query_vars['page'] ) ) {
			// If the post is actually paged and the 'page' query var is within bounds, it's all good.
			$next = '<!--nextpage-->';
			if ( false !== strpos( $query->post->post_content, $next ) && (int) trim( $query->query_vars['page'], '/' ) <= ( substr_count( $query->post->post_content, $next ) + 1 ) ) {
				return;
			}

			// Otherwise, this query is out of bounds, so set a 404.
			$query->set_404();
			return;
		}

		// If no posts were found, this is technically a 404.
		if ( ! $query->posts ) {
			// If this is a paginated query (i.e. out of bounds), always consider it a 404.
			if ( $query->is_paged() ) {
				$query->set_404();
				return;
			}

			// If this is an author archive, don't consider it a 404 if the author exists.
			if ( $query->is_author() ) {
				$author = $query->get( 'author' );
				if ( is_numeric( $author ) && $author > 0 && is_user_member_of_blog( $author ) ) {
					return;
				}
			}

			// If this is a valid taxonomy or post type archive, don't consider it a 404.
			if ( ( $query->is_category() || $query->is_tag() || $query->is_tax() || $query->is_post_type_archive() ) && $query->get_queried_object() ) {
				return;
			}

			// If this is a search results page or the home index, don't consider it a 404.
			if ( $query->is_home() || $query->is_search() ) {
				return;
			}

			// Otherwise, set a 404.
			$query->set_404();
		}
	}

	/**
	 * Normalizes the URL for further processing.
	 *
	 * @since 1.15.0
	 *
	 * @param string $url URL to normalize.
	 * @return string Normalized URL, or empty string if URL is irrelevant for parsing into `WP_Query` arguments.
	 */
	private static function normalize_url( $url ) {
		global $wp_rewrite;

		$url_host      = str_replace( 'www.', '', wp_parse_url( $url, PHP_URL_HOST ) );
		$home_url_host = str_replace( 'www.', '', wp_parse_url( home_url(), PHP_URL_HOST ) );

		// Bail early if the URL does not belong to this site.
		if ( $url_host && $url_host !== $home_url_host ) {
			return '';
		}

		// Strip 'index.php/' if we're not using path info permalinks.
		if ( ! $wp_rewrite->using_index_permalinks() ) {
			$url = str_replace( $wp_rewrite->index . '/', '', $url );
		}

		return $url;
	}

	/**
	 * Parses the path segment of a URL to get variables based on WordPress rewrite rules.
	 *
	 * The variables returned from this method are not necessarily all relevant for a `WP_Query`, they will still need
	 * to go through sanitization against the available public query vars from WordPress.
	 *
	 * This code is mostly a partial copy of `WP::parse_request()` which is used to parse the current request URL
	 * into variables in a similar way.
	 *
	 * @since 1.15.0
	 *
	 * @param string $url URL to parse path vars from.
	 * @return array Associative array of path vars.
	 */
	private static function get_url_path_vars( $url ) {
		global $wp_rewrite;

		$url_path = wp_parse_url( $url, PHP_URL_PATH );

		// Strip potential home URL path segment from URL path.
		$home_path = untrailingslashit( wp_parse_url( home_url( '/' ), PHP_URL_PATH ) );
		if ( ! empty( $home_path ) ) {
			$url_path = substr( $url_path, strlen( $home_path ) );
		}

		// Strip leading and trailing slashes.
		$url_path = trim( $url_path, '/' );

		// Fetch the rewrite rules.
		$rewrite = $wp_rewrite->wp_rewrite_rules();

		// Match path against rewrite rules.
		$matched_rule = '';
		$query        = '';
		$matches      = array();
		if ( empty( $url_path ) || $url_path === $wp_rewrite->index ) {
			if ( isset( $rewrite['$'] ) ) {
				$matched_rule = '$';
				$query        = $rewrite['$'];
				$matches      = array( '' );
			}
		} else {
			foreach ( (array) $rewrite as $match => $query ) {
				if ( preg_match( "#^$match#", $url_path, $matches ) ) {
					if ( $wp_rewrite->use_verbose_page_rules && preg_match( '/pagename=\$matches\[([0-9]+)\]/', $query, $varmatch ) ) {
						// This is a verbose page match, let's check to be sure about it.
						// We'll rely 100% on WP core functions here.
						// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions
						$page = get_page_by_path( $matches[ $varmatch[1] ] );
						if ( ! $page ) {
							continue;
						}

						$post_status_obj = get_post_status_object( $page->post_status );
						if ( ! $post_status_obj->public && ! $post_status_obj->protected
							&& ! $post_status_obj->private && $post_status_obj->exclude_from_search ) {
							continue;
						}
					}

					$matched_rule = $match;
					break;
				}
			}
		}

		// If rewrite rules matched, populate $url_path_vars.
		$url_path_vars = array();
		if ( $matched_rule ) {
			// Trim the query of everything up to the '?'.
			$query = preg_replace( '!^.+\?!', '', $query );

			// Substitute the substring matches into the query.
			$query = addslashes( \WP_MatchesMapRegex::apply( $query, $matches ) );

			parse_str( $query, $url_path_vars );
		}

		return $url_path_vars;
	}

	/**
	 * Parses the query segment of a URL to get variables.
	 *
	 * The variables returned from this method are not necessarily all relevant for a `WP_Query`, they will still need
	 * to go through sanitization against the available public query vars from WordPress.
	 *
	 * @since 1.15.0
	 *
	 * @param string $url URL to parse query vars from.
	 * @return array Associative array of query vars.
	 */
	private static function get_url_query_vars( $url ) {
		$url_query = wp_parse_url( $url, PHP_URL_QUERY );

		$url_query_vars = array();
		if ( $url_query ) {
			parse_str( $url_query, $url_query_vars );
		}

		return $url_query_vars;
	}

	/**
	 * Returns arguments for a `WP_Query` instance based on URL path vars and URL query vars.
	 *
	 * This method essentially sanitizes the passed vars, allowing only WordPress public query vars to be used as
	 * actual arguments for `WP_Query`. When combining URL path vars and URL query vars, the latter take precedence.
	 *
	 * This code is mostly a partial copy of `WP::parse_request()` which is used to parse the current request URL
	 * into query arguments in a similar way.
	 *
	 * @since 1.15.0
	 *
	 * @param array $url_path_vars  Associative array as returned from {@see WP_Query_Factory::get_url_path_vars()}.
	 * @param array $url_query_vars Associative array as returned from {@see WP_Query_Factory::get_url_query_vars()}.
	 * @return array Associative array of arguments to pass to a `WP_Query` instance.
	 */
	private static function parse_wp_query_args( array $url_path_vars, array $url_query_vars ) {
		global $wp;

		// Determine available post type query vars.
		$post_type_query_vars = array();
		foreach ( get_post_types( array(), 'objects' ) as $post_type => $post_type_obj ) {
			if ( is_post_type_viewable( $post_type_obj ) && $post_type_obj->query_var ) {
				$post_type_query_vars[ $post_type_obj->query_var ] = $post_type;
			}
		}

		// Depending on whether WordPress already parsed the main request (and thus filtered 'query_vars'), we should
		// either manually trigger the filter or not.
		if ( did_action( 'parse_request' ) ) {
			$public_query_vars = $wp->public_query_vars;
		} else {
			$public_query_vars = apply_filters( 'query_vars', $wp->public_query_vars );
		}

		// Populate `WP_Query` arguments.
		$query_args = array();
		foreach ( $public_query_vars as $wpvar ) {
			if ( isset( $url_query_vars[ $wpvar ] ) ) {
				$query_args[ $wpvar ] = $url_query_vars[ $wpvar ];
			} elseif ( isset( $url_path_vars[ $wpvar ] ) ) {
				$query_args[ $wpvar ] = $url_path_vars[ $wpvar ];
			}

			if ( ! empty( $query_args[ $wpvar ] ) ) {
				if ( ! is_array( $query_args[ $wpvar ] ) ) {
					$query_args[ $wpvar ] = (string) $query_args[ $wpvar ];
				} else {
					foreach ( $query_args[ $wpvar ] as $key => $value ) {
						if ( is_scalar( $value ) ) {
							$query_args[ $wpvar ][ $key ] = (string) $value;
						}
					}
				}

				if ( isset( $post_type_query_vars[ $wpvar ] ) ) {
					$query_args['post_type'] = $post_type_query_vars[ $wpvar ];
					$query_args['name']      = $query_args[ $wpvar ];
				}
			}
		}

		// Convert urldecoded spaces back into '+'.
		foreach ( get_taxonomies( array(), 'objects' ) as $taxonomy => $taxonomy_obj ) {
			if ( $taxonomy_obj->query_var && isset( $query_args[ $taxonomy_obj->query_var ] ) ) {
				$query_args[ $taxonomy_obj->query_var ] = str_replace( ' ', '+', $query_args[ $taxonomy_obj->query_var ] );
			}
		}

		// Don't allow non-publicly queryable taxonomies to be queried from the front end.
		foreach ( get_taxonomies( array( 'publicly_queryable' => false ), 'objects' ) as $taxonomy => $t ) {
			if ( isset( $query_args['taxonomy'] ) && $taxonomy === $query_args['taxonomy'] ) {
				unset( $query_args['taxonomy'], $query_args['term'] );
			}
		}

		// Limit publicly queried post_types to those that are 'publicly_queryable'.
		if ( isset( $query_args['post_type'] ) ) {
			$queryable_post_types = get_post_types( array( 'publicly_queryable' => true ) );
			if ( ! is_array( $query_args['post_type'] ) ) {
				if ( ! in_array( $query_args['post_type'], $queryable_post_types, true ) ) {
					unset( $query_args['post_type'] );
				}
			} else {
				$query_args['post_type'] = array_intersect( $query_args['post_type'], $queryable_post_types );
			}
		}

		// Resolve conflicts between posts with numeric slugs and date archive queries.
		$query_args = wp_resolve_numeric_slug_conflicts( $query_args );

		// This is a WordPress core filter applied here to allow for the same modifications (e.g. for post formats).
		$query_args = apply_filters( 'request', $query_args );

		return $query_args;
	}
}
