import React, { useMemo, useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, arrayOf, shape, string, number } from 'prop-types';

import { useFilterSidebar } from '@magento/peregrine/lib/talons/FilterSidebar';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import defaultClasses from '@magento/venia-ui/lib/components/FilterSidebar/filterSidebar.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

import CurrentFilters from '../CurrentFilters';
import FilterBlock from '../FilterBlock';

const SCROLL_OFFSET = 150;

const FilterSidebar = props => {
    // REFS
    const filterRef = useRef();

    // PROPS
    const { filters, filterCountToOpen } = props;

    // CUSTOM HOOKS
    const talonProps = useFilterSidebar({ filters });
    const classes = useStyle(defaultClasses, props.classes);

    // VARIABLES
    const {
        filterApi,
        filterItems,
        filterNames,
        filterState,
        handleApply,
        handleReset
    } = talonProps;

    // FUNCTIONS
    const handleApplyFilter = useCallback(
        (...args) => {
            const filterElement = filterRef.current;
            if (
                filterElement &&
                typeof filterElement.getBoundingClientRect === 'function'
            ) {
                const filterTop = filterElement.getBoundingClientRect().top;
                const windowScrollY =
                    window.scrollY + filterTop - SCROLL_OFFSET;
                window.scrollTo(0, windowScrollY);
            }

            handleApply(...args);
        },
        [handleApply, filterRef]
    );

    // COMPONENTS
    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items], iteration) => {
                const blockState = filterState.get(group);
                const groupName = filterNames.get(group);

                return (
                    <FilterBlock
                        key={group}
                        filterApi={filterApi}
                        filterState={blockState}
                        group={group}
                        items={items}
                        name={groupName}
                        onApply={handleApplyFilter}
                        initialOpen={iteration < filterCountToOpen}
                    />
                );
            }),
        [
            filterApi,
            filterItems,
            filterNames,
            filterState,
            filterCountToOpen,
            handleApplyFilter
        ]
    );

    const clearAll = filterState.size ? (
        <div className={classes.action}>
            <LinkButton
                type="button"
                onClick={handleReset}
                data-cy="FilterSidebar-clearButton"
            >
                <FormattedMessage
                    id={'filterModal.action'}
                    defaultMessage={'Clear all'}
                />
            </LinkButton>
        </div>
    ) : null;

    return (
        <aside
            className={classes.root}
            ref={filterRef}
            data-cy="FilterSidebar-root"
            aria-live="polite"
            aria-busy="false"
        >
            <div className={classes.body}>
                <div className={classes.header}>
                    <h2
                        data-cy="FilterSidebar-headerTitle"
                        className={classes.headerTitle}
                    >
                        <FormattedMessage
                            id={'filterModal.headerTitle'}
                            defaultMessage={'Filters'}
                        />
                    </h2>
                </div>
                <CurrentFilters
                    filterApi={filterApi}
                    filterNames={filterNames}
                    filterState={filterState}
                    onRemove={handleApplyFilter}
                />
                {clearAll}
                <ul className={classes.blocks}>{filtersList}</ul>
            </div>
        </aside>
    );
};

FilterSidebar.defaultProps = {
    filterCountToOpen: 3
};

FilterSidebar.propTypes = {
    classes: shape({
        action: string,
        blocks: string,
        body: string,
        header: string,
        headerTitle: string,
        root: string,
        root_open: string
    }),
    filters: arrayOf(
        shape({
            attribute_code: string,
            items: array
        })
    ),
    filterCountToOpen: number
};

export default FilterSidebar;
