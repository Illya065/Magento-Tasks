/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, Suspense, useEffect, useRef } from 'react';
import { shape, string } from 'prop-types';
import { Link, Route } from 'react-router-dom';

import AccountTrigger from '@magento/venia-ui/lib/components/Header/accountTrigger';
import CartTrigger from '@magento/venia-ui/lib/components/Header/cartTrigger';
import NavTrigger from '@magento/venia-ui/lib/components/Header/navTrigger';
import SearchTrigger from '@magento/venia-ui/lib/components/Header/searchTrigger';
import OnlineIndicator from '@magento/venia-ui/lib/components/Header/onlineIndicator';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import StoreSwitcher from '@magento/venia-ui/lib/components/Header/storeSwitcher';
import CurrencySwitcher from '@magento/venia-ui/lib/components/Header/currencySwitcher';
import PageLoadingIndicator from '@magento/venia-ui/lib/components/PageLoadingIndicator';
import { useStyle } from '@magento/venia-ui/lib/classify';

import customClasses from './header.module.css';
import MegaMenu from '../MegaMenu';
import Logo from '../Logo';

const SearchBar = React.lazy(() =>
    import('@magento/venia-ui/lib/components/SearchBar')
);

const Header = props => {
    // REFS
    const headerRef = useRef(null);

    // VARIABLES
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0
    };

    // FUNCTIONS
    const callback = function(entries) {
        if (headerRef.current) {
            if (entries[0].isIntersecting) {
                headerRef.current.style.position = 'relative';
                headerRef.current.style.backgroundColor = 'rgb(255,255,255)';
            } else {
                headerRef.current.style.position = 'sticky';
                headerRef.current.style.backgroundColor =
                    'rgba(255,255,255, 0.95)';
            }
        }
    };

    const observer = new IntersectionObserver(callback, options);

    // EFFECT HOOKS
    useEffect(() => {
        observer.observe(document.querySelector('.my-header'));
    }, []);

    // CUSTOM HOOKS
    const {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isSearchOpen,
        searchRef,
        searchTriggerRef
    } = useHeader();
    const classes = useStyle(props.classes, customClasses);

    const rootClass = isSearchOpen ? classes.open : classes.closed;

    // COMPONENTS
    const searchBarFallback = (
        <div className={classes.searchFallback} ref={searchRef}>
            <div className={classes.input}>
                <div className={classes.loader} />
            </div>
        </div>
    );
    const searchBar = isSearchOpen ? (
        <Suspense fallback={searchBarFallback}>
            <Route>
                <SearchBar isOpen={isSearchOpen} ref={searchRef} />
            </Route>
        </Suspense>
    ) : null;

    return (
        <Fragment>
            <div
                className={[classes.switchersContainer, 'my-header'].join(' ')}
            >
                <div className={classes.switchers} data-cy="Header-switchers">
                    <StoreSwitcher />
                    <CurrencySwitcher />
                </div>
            </div>
            <header
                ref={headerRef}
                data-cy="Header-root"
                className={[rootClass, classes.customHeader].join(' ')}
            >
                <div className={classes.toolbar}>
                    <div className={classes.primaryActions}>
                        <NavTrigger />
                    </div>
                    <OnlineIndicator
                        hasBeenOffline={hasBeenOffline}
                        isOnline={isOnline}
                    />
                    <Link
                        to={resourceUrl('/')}
                        className={classes.logoContainer}
                    >
                        <Logo classes={{ logo: classes.logo }} />
                    </Link>
                    <MegaMenu />
                    <div className={classes.secondaryActions}>
                        <SearchTrigger
                            onClick={handleSearchTriggerClick}
                            ref={searchTriggerRef}
                        />
                        <AccountTrigger />
                        <CartTrigger />
                    </div>
                </div>
                {searchBar}
                <PageLoadingIndicator absolute />
            </header>
        </Fragment>
    );
};

Header.propTypes = {
    classes: shape({
        closed: string,
        logo: string,
        open: string,
        primaryActions: string,
        secondaryActions: string,
        toolbar: string,
        switchers: string,
        switchersContainer: string
    })
};

export default Header;
