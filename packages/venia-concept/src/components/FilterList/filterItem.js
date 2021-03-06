import React, { useCallback, useMemo } from 'react';
import { func, number, oneOfType, shape, string } from 'prop-types';

import setValidator from '@magento/peregrine/lib/validators/set';
import FilterDefault from '@magento/venia-ui/lib/components/FilterModal/FilterList/filterDefault';

const FilterItem = props => {
    // PROPS
    const { filterApi, filterState, group, item, onApply } = props;

    // VARIABLES
    const { toggleItem } = filterApi;
    const { title, value } = item;
    const isSelected = filterState && filterState.has(item);

    // create and memoize an item that matches the tile interface
    const tileItem = useMemo(
        () => ({
            label: title,
            value_index: value
        }),
        [title, value]
    );

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

    const handleKeyDown = useCallback(
        e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleItem({ group, item });
                if (typeof onApply === 'function') {
                    onApply(group, item);
                }
            }
        },
        [group, item, onApply, toggleItem]
    );

    return (
        <FilterDefault
            isSelected={isSelected}
            item={tileItem}
            onMouseDown={handleClick}
            onKeyDown={handleKeyDown}
            title={title}
            value={value}
        />
    );
};

FilterItem.defaultProps = {
    onChange: null
};

FilterItem.propTypes = {
    filterApi: shape({
        toggleItem: func.isRequired
    }).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    item: shape({
        title: string.isRequired,
        value: oneOfType([number, string]).isRequired
    }).isRequired,
    onChange: func
};

export default FilterItem;
