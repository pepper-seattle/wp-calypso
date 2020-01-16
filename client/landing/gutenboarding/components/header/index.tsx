/**
 * External dependencies
 */
import { __ as NO__ } from '@wordpress/i18n';
import { Icon, IconButton, Button, TextControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import React, { FunctionComponent, useState } from 'react';
import { useDebounce } from 'use-debounce';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { DomainSuggestions, CurrentUser } from '@automattic/data-stores';
import { STORE_KEY as ONBOARD_STORE } from '../../stores/onboard';
import './style.scss';
import DomainPickerButton from '../domain-picker-button';
import { selectorDebounce } from '../../constants';
import Link from '../link';

const DOMAIN_SUGGESTIONS_STORE = DomainSuggestions.register();

interface Props {
	isEditorSidebarOpened: boolean;
	next?: string;
	prev?: string;
	toggleGeneralSidebar: () => void;
	toggleSidebarShortcut: KeyboardShortcut;
}

interface KeyboardShortcut {
	raw: string;
	display: string;
	ariaLabel: string;
}

const CURRENT_USER_STORE = CurrentUser.register();

const Header: FunctionComponent< Props > = ( {
	isEditorSidebarOpened,
	next,
	prev,
	toggleGeneralSidebar,
	toggleSidebarShortcut,
} ) => {
	const { domain, siteTitle, siteVertical } = useSelect( select =>
		select( ONBOARD_STORE ).getState()
	);
	const { setDomain } = useDispatch( ONBOARD_STORE );
	const { createAccount } = useDispatch( CURRENT_USER_STORE );
	const [ email, setEmail ] = useState( '' );

	const currentUser = useSelect( select => select( CURRENT_USER_STORE ).getCurrentUser() );
	const newUser = useSelect( select => select( CURRENT_USER_STORE ).getNewUser() );
	const isLoggedIn = !! currentUser?.ID;
	const isNewUser = !! newUser;

	const [ domainSearch ] = useDebounce(
		// If we know a domain, do not search.
		! domain && siteTitle,
		selectorDebounce
	);
	const freeDomainSuggestion = useSelect(
		select => {
			if ( ! domainSearch ) {
				return;
			}
			return select( DOMAIN_SUGGESTIONS_STORE ).getDomainSuggestions( domainSearch, {
				// Avoid `only_wordpressdotcom` — it seems to fail to find results sometimes
				include_wordpressdotcom: true,
				quantity: 1,
				...{ vertical: siteVertical?.id },
			} )?.[ 0 ];
		},
		[ domainSearch, siteVertical ]
	);

	const currentDomain = domain ?? freeDomainSuggestion;

	/* eslint-disable wpcalypso/jsx-classname-namespace */
	const siteTitleElement = (
		<span className="gutenboarding__site-title">
			{ siteTitle ? siteTitle : NO__( 'Create your site' ) }
		</span>
	);

	const domainElement = (
		<span
			className={ classnames( 'gutenboarding__header-domain-picker-button-domain', {
				placeholder: ! currentDomain,
			} ) }
		>
			{ currentDomain ? currentDomain.domain_name : 'example.wordpress.com' }
		</span>
	);

	const createAccountHandler = () => {
		createAccount( { email } );
	};

	return (
		<div
			className="gutenboarding__header"
			role="region"
			aria-label={ NO__( 'Top bar' ) }
			tabIndex={ -1 }
		>
			<div className="gutenboarding__header-section">
				<div className="gutenboarding__header-group">
					{ isLoggedIn && ! prev ? (
						<a className="gutenboarding__header-back-button" href="/sites">
							<Icon icon="arrow-left-alt" />
							{ NO__( 'Back to My Sites' ) }
						</a>
					) : (
						<Link className="gutenboarding__header-back-button" to={ prev }>
							<Icon icon="arrow-left-alt" />
							{ NO__( 'Back' ) }
						</Link>
					) }
				</div>
				<div className="gutenboarding__header-group">
					{ siteTitle ? (
						<DomainPickerButton
							className="gutenboarding__header-domain-picker-button"
							defaultQuery={ siteTitle }
							disabled={ ! currentDomain }
							onDomainSelect={ setDomain }
							queryParameters={ { vertical: siteVertical?.id } }
						>
							{ siteTitleElement }
							{ domainElement }
						</DomainPickerButton>
					) : (
						siteTitleElement
					) }
				</div>
			</div>
			<div className="gutenboarding__header-section">
				{ isNewUser && <span> { NO__( 'New user created!' ) } </span> }
				<TextControl
					label={ NO__( 'Email address' ) }
					value={ email }
					onChange={ newEmail => setEmail( newEmail ) }
				/>
				<Button isPrimary isLarge onClick={ createAccountHandler }>
					{ NO__( 'Create account' ) }
				</Button>
				<Link to={ next } className="gutenboarding__header-next-button" isPrimary isLarge>
					{ NO__( 'Next' ) }
				</Link>
				<div className="gutenboarding__header-group">
					<IconButton
						aria-expanded={ isEditorSidebarOpened }
						aria-haspopup="menu"
						aria-pressed={ isEditorSidebarOpened }
						icon="admin-generic"
						isToggled={ isEditorSidebarOpened }
						label={ NO__( 'Site block settings' ) }
						onClick={ toggleGeneralSidebar }
						shortcut={ toggleSidebarShortcut }
					/>
				</div>
			</div>
		</div>
	);
	/* eslint-enable wpcalypso/jsx-classname-namespace */
};

export default Header;
