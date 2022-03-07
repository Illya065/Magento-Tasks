import React, { Fragment, useMemo } from 'react';
import { array, func, shape, string } from 'prop-types';

import { useFilterList } from '@magento/peregrine/lib/talons/FilterModal';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/FilterModal/FilterList/filterList.module.css';
import setValidator from '@magento/peregrine/lib/validators/set';

import FilterColorItem from './filterColorItem';
import customClasses from './filterColor.module.css';

const labels = new WeakMap();

const FilterColor = props => {
    // PROPS
    const {
        filterApi,
        filterState,
        group,
        itemCountToShow,
        items,
        onApply
    } = props;

    // CUSTOM HOOKS
    const classes = useStyle(defaultClasses, props.classes, customClasses);
    const talonProps = useFilterList({ filterState, items, itemCountToShow });

    // VARIABLES
    const { isListExpanded } = talonProps;

    // COMPONENTS
    const itemElements = useMemo(
        () =>
            items.map((item, index) => {
                const { title, value } = item;
                const key = `item-${group}-${value}`;

                if (!isListExpanded && index >= itemCountToShow) {
                    return null;
                }

                // create an element for each item
                const element = (
                    <li
                        key={key}
                        className={classes.item}
                        data-cy="FilterList-item"
                    >
                        <FilterColorItem
                            filterApi={filterApi}
                            filterState={filterState}
                            group={group}
                            item={item}
                            onApply={onApply}
                        />
                    </li>
                );

                // associate each element with its normalized title
                // titles are not unique, so use the element as the key
                labels.set(element, title.toUpperCase());

                return element;
            }),
        [
            classes,
            filterApi,
            filterState,
            group,
            items,
            isListExpanded,
            itemCountToShow,
            onApply
        ]
    );

    return (
        <Fragment>
            <ul className={classes.filterColorList}>{itemElements}</ul>
        </Fragment>
    );
};

FilterColor.propTypes = {
    filterApi: shape({}),
    filterState: setValidator,
    group: string,
    items: array,
    onApply: func
};

export default FilterColor;
