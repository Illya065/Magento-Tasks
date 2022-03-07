/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback } from 'react';
import { func, object, shape, string } from 'prop-types';
import setValidator from '@magento/peregrine/lib/validators/set';

import defaultClasses from './filterColorItem.module.css';

const FilterColorItem = props => {
    // PROPS
    const { filterApi, filterState, group, item, onApply } = props;

    // VARIABLES
    const { toggleItem } = filterApi;
    const { title } = item;
    const isSelected = filterState && filterState.has(item);
    const hexColor = title.split('_')[0];

    // FUNCTIONS
    const handleClick = useCallback(
        e => {
            // use only left click for selection
            if (e.button !== 0) return;

            toggleItem({ group, item });

            if (typeof onApply === 'function') {
                onApply(group, item);
            }
        },
        [group, item, toggleItem, onApply]
    );

    return (
        <div
            onClick={handleClick}
            style={{ backgroundColor: hexColor }}
            className={[
                defaultClasses.filterColorItem,
                isSelected ? defaultClasses.filterColorItemSelected : ''
            ].join(' ')}
        />
    );
};

FilterColorItem.propTypes = {
    filterApi: shape({}),
    filterState: setValidator,
    group: string,
    item: object,
    onApply: func
};

export default FilterColorItem;
