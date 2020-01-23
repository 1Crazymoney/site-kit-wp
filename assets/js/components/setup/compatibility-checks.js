/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import ProgressBar from 'GoogleComponents/progress-bar';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Warning from '../notifications/warning';

/**
 * Internal dependencies
 */
import { getExistingTag } from '../../util';
import data, { TYPE_CORE } from '../data';
import Link from '../link';

export const tagMatchers = [
	/<meta name="googlesitekit-setup" content="([a-z0-9-]+)"/,
];

const checks = [
	async () => {
		const { hostname } = window.location;

		if ( hostname === 'localhost' || hostname.match( /\.(example|invalid|localhost|test)$/ ) ) {
			throw 'invalid_hostname';
		}
	},
	async () => {
		const { token } = await data.set( TYPE_CORE, 'site', 'setup-tag' );

		const scrapedTag = await getExistingTag( 'setup' ).catch( () => {
			throw 'tag_fetch_failed';
		} );

		if ( token !== scrapedTag ) {
			throw 'setup_token_mismatch';
		}
	},
];

export default class CompatibilityChecks extends Component {
	constructor( props ) {
		const { isSiteKitConnected } = window.googlesitekit.setup;
		super( props );
		this.state = {
			complete: isSiteKitConnected,
			error: null,
			helperPlugin: {},
		};
	}

	async componentDidMount() {
		if ( this.state.complete ) {
			return;
		}
		try {
			this.onStart();
			for ( const testCallback of checks ) {
				await testCallback();
			}
		} catch ( error ) {
			const helperPlugin = await data.get( TYPE_CORE, 'site', 'helper-plugin' );
			this.setState( { error, helperPlugin } );
		}

		this.setState( { complete: true }, this.onComplete );
	}

	onStart() {
		const { onStart } = this.props;

		if ( typeof onStart === 'function' ) {
			onStart();
		}
	}

	onComplete() {
		const { onComplete } = this.props;

		if ( typeof onComplete === 'function' ) {
			onComplete();
		}
	}

	helperCTA() {
		const { installed, active, installURL, activateURL, configureURL } = this.state.helperPlugin;

		if ( ! installed && installURL ) {
			return {
				labelHTML: __( 'Install<span class="screen-reader-text"> the helper plugin</span>', 'google-site-kit' ),
				href: installURL,
				external: false,
			};
		}
		if ( installed && ! active && activateURL ) {
			return {
				labelHTML: __( 'Activate<span class="screen-reader-text"> the helper plugin</span>', 'google-site-kit' ),
				href: activateURL,
				external: false,
			};
		}
		if ( installed && active && configureURL ) {
			return {
				labelHTML: __( 'Configure<span class="screen-reader-text"> the helper plugin</span>', 'google-site-kit' ),
				href: configureURL,
				external: false,
			};
		}
		return {
			labelHTML: __( 'Learn how<span class="screen-reader-text"> to install and use the helper plugin</span>', 'google-site-kit' ),
			href: 'https://sitekit.withgoogle.com/documentation/using-site-kit-on-a-staging-environment/',
			external: true,
		};
	}

	renderError( error ) {
		const { installed } = this.state.helperPlugin;
		const { labelHTML, href, external } = this.helperCTA();

		switch ( error ) {
			case 'invalid_hostname':
			case 'tag_fetch_failed':
				return <Fragment>
					{ ! installed && __( 'Looks like this may be a staging environment. If so, you’ll need to install a helper plugin and verify your production site in Search Console.', 'google-site-kit' ) }
					{ installed && __( 'Looks like this may be a staging environment and you already have the helper plugin. Before you can use Site Kit, please make sure you’ve provided the necessary credentials in the Authentication section and verified your production site in Search Console.', 'google-site-kit' ) }
					{ ' ' }
					<Link
						href={ href }
						dangerouslySetInnerHTML={ { __html: labelHTML } }
						external={ external }
						inherit
					/>
				</Fragment>;
			case 'setup_token_mismatch':
				return __( 'Looks like you may be using a caching plugin which could interfere with setup. Please deactivate any caching plugins before setting up Site Kit. You may reactivate them once setup has been completed.', 'google-site-kit' );
		}
	}

	render() {
		const { complete, error } = this.state;
		const { children, ...restProps } = this.props;

		let CTAFeedback;
		let inProgressFeedback;

		if ( error ) {
			CTAFeedback = <Fragment>
				<div className="mdc-layout-grid mdc-layout-grid--align-left" style={ { maxWidth: '60rem' } }>
					<div className="mdc-layout-grid__inner">
						<Warning />
						<div className="googlesitekit-heading-4 mdc-layout-grid__cell--span-11">
							{ __( 'Your site may not be ready for Site Kit', 'google-site-kit' ) }
						</div>
					</div>
					<p>{ this.renderError( error ) }</p>
				</div>
			</Fragment>;
		}

		if ( ! complete ) {
			inProgressFeedback = <div style={ { alignSelf: 'center', marginLeft: '1rem' } }>
				<small>{ __( 'Checking Compatibility...', 'google-site-kit' ) }</small>
				<ProgressBar small compress />
			</div>;
		}

		return children( {
			restProps,
			complete,
			error,
			inProgressFeedback,
			CTAFeedback,
		} );
	}
}

CompatibilityChecks.propTypes = {
	children: PropTypes.func.isRequired,
	onStart: PropTypes.func,
	onComplete: PropTypes.func,
};
