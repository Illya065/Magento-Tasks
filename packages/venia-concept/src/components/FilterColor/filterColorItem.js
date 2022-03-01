/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback } from 'react';
import defaultClasses from './filterColorItem.module.css';

const FilterColorItem = props => {
    // VARIABLES
    const { filterApi, filterState, group, item, onApply } = props;
    const { toggleItem } = filterApi;
    const { title } = item;
    const isSelected = filterState && filterState.has(item);
    const hexColor = title.split('_')[0];

    console.log('item', item);

    // FUNCUTIONS
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

    console.log(props);

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

export default FilterColorItem;
