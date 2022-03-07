/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
    Fragment,
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { array, number, shape, string } from 'prop-types';

import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import ProductSort, {
    ProductSortShimmer
} from '@magento/venia-ui/lib/components/ProductSort';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import SortedByContainer, {
    SortedByContainerShimmer
} from '@magento/venia-ui/lib/components/SortedByContainer';
import defaultClasses from '@magento/venia-ui/lib/RootComponents/Category/category.module.css';
import NoProductsFound from '@magento/venia-ui/lib/RootComponents/Category/NoProductsFound';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useMegaMenu } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenu';

import Pagination from '../Pagination';
import customClasses from './categoryContent.module.css';
import { ContentViewProvider } from './contentViewContext';
import CategoryList from './categoryList';
import Gallery from '../Gallery';

const FilterModal = React.lazy(() => import('../FilterModal'));
const FilterSidebar = React.lazy(() => import('../FilterSidebar'));

const CategoryContent = props => {
    // REFS
    const mainNavRef = useRef(null);
    const sidebarRef = useRef(null);

    // PROPS
    const {
        categoryId,
        data,
        isLoading,
        pageControl,
        sortProps,
        pageSize
    } = props;

    // CUSTOM HOOKS
    const { urlList } = useMegaMenu({ mainNavRef });
    const talonProps = useCategoryContent({
        categoryId,
        data,
        pageSize
    });
    const classes = useStyle(defaultClasses, props.classes, customClasses);
    const shouldRenderSidebarContent = useIsInViewport({
        elementRef: sidebarRef
    });

    // VARIABLES
    const {
        availableSortMethods,
        categoryName,
        categoryDescription,
        filters,
        items,
        totalCount,
        totalPagesFromData
    } = talonProps;
    const { currentPage, setPage } = pageControl;
    const [currentSort] = sortProps;
    const location = useLocation();
    const history = useHistory();

    // STATE HOOKS
    const [infiniteItems, setInfiniteItems] = useState({});
    const [view, setView] = useState(localStorage.getItem('view') || 'list');

    // EFFECT HOOKS
    useEffect(() => {
        // set category content type view (url query)
        const urlParams = new URLSearchParams(location.search);
        if (view === 'list' && !urlParams.get('view')) {
            urlParams.set('view', 'list');
            location.search = urlParams.toString();
            history.push(`${location.pathname}?${location.search}`);
        }

        if (view === 'grid' && urlParams.get('view')) {
            urlParams.delete('view');
            history.push(urlParams);
        }
    }, [view, location.pathname]);

    useEffect(() => {
        // infinite scroll
        window.scrollTo(0, 0);
        setInfiniteItems({});
        setPage(1);
    }, []);

    useEffect(() => {
        // infinite scroll set content
        const copy = JSON.parse(JSON.stringify(infiniteItems));
        copy[currentPage.toString()] = items;
        setInfiniteItems(copy);
    }, [items, pageControl, currentPage]);

    const infiniteScrollArray = Object.values(infiniteItems)
        .flat(1)
        .filter(i => i);

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = totalPagesFromData && availableSortMethods;
    const shouldShowSortShimmer = !totalPagesFromData && isLoading;

    // COMPONENTS
    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const filtersModal = shouldShowFilterButtons ? (
        <FilterModal filters={filters} />
    ) : null;

    const sidebar = shouldShowFilterButtons ? (
        <FilterSidebar filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort
            sortProps={sortProps}
            availableSortMethods={availableSortMethods}
        />
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer currentSort={currentSort} />
    ) : shouldShowSortShimmer ? (
        <SortedByContainerShimmer />
    ) : null;

    const categoryResultsHeading =
        totalCount > 0 ? (
            <FormattedMessage
                id={'categoryContent.resultCount'}
                values={{
                    count: totalCount
                }}
                defaultMessage={'{count} Results'}
            />
        ) : isLoading ? (
            <Shimmer width={5} />
        ) : null;

    const categoryDescriptionElement = categoryDescription ? (
        <RichContent html={categoryDescription} />
    ) : null;

    const content = useMemo(() => {
        if (!totalPagesFromData && !isLoading) {
            return <NoProductsFound categoryId={categoryId} />;
        }

        const gallery =
            totalPagesFromData && infiniteScrollArray[0] !== null ? (
                <Gallery items={infiniteScrollArray} view={view} />
            ) : null;

        const pagination = totalPagesFromData ? (
            <Pagination pageControl={pageControl} />
        ) : null;

        return (
            <Fragment>
                <ContentViewProvider value={view}>
                    <div className={classes.contentViewToggler}>
                        <button
                            disabled={view === 'list' && 'disabled'}
                            className={[
                                classes.contentViewButton,
                                view === 'list' &&
                                    classes.contentViewButtonActive
                            ].join(' ')}
                            onClick={e => contentViewChangeHandler(e, 'list')}
                        >
                            <img src="../../../assets/ListIcon.png" alt="" />
                        </button>
                        <button
                            disabled={view === 'grid' && 'disabled'}
                            className={[
                                classes.contentViewButton,
                                view === 'grid' &&
                                    classes.contentViewButtonActive
                            ].join(' ')}
                            onClick={e => contentViewChangeHandler(e, 'grid')}
                        >
                            <img src="../../../assets/MenuIcon.png" alt="" />
                        </button>
                    </div>
                    <section className={classes.gallery}>{gallery}</section>
                    <div className={classes.pagination}>{pagination}</div>
                </ContentViewProvider>
            </Fragment>
        );
    }, [
        categoryId,
        classes.gallery,
        classes.pagination,
        isLoading,
        items,
        pageControl,
        totalPagesFromData,
        view
    ]);

    const categoryTitle = categoryName ? categoryName : <Shimmer width={5} />;

    // FUNCTIONS
    const contentViewChangeHandler = (e, view) => {
        e.preventDefault();

        if (view === 'list') {
            localStorage.setItem('view', 'list');
            setView('list');
        } else {
            localStorage.setItem('view', 'grid');
            setView('grid');
        }
    };

    return (
        <Fragment>
            <Breadcrumbs categoryId={categoryId} />
            <StoreTitle>{categoryName}</StoreTitle>
            <article className={classes.root} data-cy="CategoryContent-root">
                <div className={classes.categoryHeader}>
                    <h1 className={classes.title}>
                        <div
                            className={classes.categoryTitle}
                            data-cy="CategoryContent-categoryTitle"
                        >
                            {categoryTitle}
                        </div>
                    </h1>
                    {categoryDescriptionElement}
                </div>
                <div className={classes.contentWrapper}>
                    <div ref={sidebarRef} className={classes.sidebar}>
                        <Suspense fallback={<FilterSidebarShimmer />}>
                            {shouldRenderSidebarContent ? sidebar : null}
                        </Suspense>
                    </div>
                    <div className={classes.categoryContent}>
                        <div className={classes.heading}>
                            <div
                                data-cy="CategoryContent-categoryInfo"
                                className={classes.categoryInfo}
                            >
                                {categoryResultsHeading}
                                <CategoryList
                                    categoryUrlList={urlList}
                                    filters={filters}
                                />
                            </div>
                            <div className={classes.headerButtons}>
                                {maybeFilterButtons}
                                {maybeSortButton}
                            </div>
                            {maybeSortContainer}
                        </div>
                        {content}
                        <Suspense fallback={null}>{filtersModal}</Suspense>
                    </div>
                </div>
            </article>
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    classes: shape({
        gallery: string,
        pagination: string,
        root: string,
        categoryHeader: string,
        title: string,
        categoryTitle: string,
        sidebar: string,
        categoryContent: string,
        heading: string,
        categoryInfo: string,
        headerButtons: string
    }),
    sortProps: array,
    pageSize: number
};
