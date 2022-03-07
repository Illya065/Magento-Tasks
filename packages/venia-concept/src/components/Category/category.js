import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import { useCategory } from '@magento/peregrine/lib/talons/RootComponents/Category';
import defaultClasses from '@magento/venia-ui/lib/RootComponents/Category/category.module.css';
import { GET_PAGE_SIZE } from '@magento/venia-ui/lib/RootComponents/Category/category.gql';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Meta } from '@magento/venia-ui/lib/components/Head';

import CategoryContent from './categoryContent';

const Category = props => {
    // PROPS
    const { uid } = props;

    // CUSTOM HOOKS
    const talonProps = useCategory({
        id: uid,
        queries: {
            getPageSize: GET_PAGE_SIZE
        }
    });
    const classes = useStyle(defaultClasses, props.classes);

    // VARIABLES
    const {
        error,
        metaDescription,
        loading,
        categoryData,
        pageControl,
        sortProps,
        pageSize
    } = talonProps;

    if (!categoryData) {
        if (error && pageControl.currentPage === 1) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }

            return <ErrorView />;
        }
    }

    return (
        <Fragment>
            <Meta name="description" content={metaDescription} />
            <CategoryContent
                categoryId={uid}
                classes={classes}
                data={categoryData}
                isLoading={loading}
                pageControl={pageControl}
                sortProps={sortProps}
                pageSize={pageSize}
            />
        </Fragment>
    );
};

Category.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    uid: string
};

Category.defaultProps = {
    uid: 'Mg=='
};

export default Category;
