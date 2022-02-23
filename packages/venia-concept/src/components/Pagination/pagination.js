/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { func, number, shape, string } from 'prop-types';
import { usePagination } from '@magento/peregrine/lib/talons/Pagination/usePagination';

import defaultClasses from '@magento/venia-ui/lib/components/Pagination/pagination.module.css';
import customClasses from './pagination.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const Pagination = props => {
    const classes = useStyle(defaultClasses, props.classes, customClasses);

    // infinite scroll
    const { pageControl } = props;
    const { currentPage, setPage, totalPages } = pageControl;
    const talonProps = usePagination({
        currentPage,
        setPage,
        totalPages
    });

    const { handleNavForward } = talonProps;

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pageControl]);

    function handleScroll() {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
            document.documentElement.offsetHeight
        ) {
            return;
        }
        handleNavForward();
        // setPage(currentPage + 1);
        console.log('scroll', currentPage, totalPages, handleNavForward);
    }

    return (
        <div
            id="pagination-block"
            className={[classes.root, classes.infiniteScroll].join(' ')}
            // data-cy="Pagination-root"
        />
    );
};

Pagination.propTypes = {
    classes: shape({
        root: string
    }),
    pageControl: shape({
        currentPage: number,
        setPage: func,
        totalPages: number
    }).isRequired
};

export default Pagination;
