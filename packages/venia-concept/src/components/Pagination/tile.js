import React, { useCallback } from 'react';
import { bool, func, number, shape, string } from 'prop-types';

import defaultClasses from '@magento/venia-ui/lib/components/Pagination/tile.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const Tile = props => {
    const { isActive, number, onClick } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isActive ? classes.root_active : classes.root;
    const handleClick = useCallback(() => onClick(number), [onClick, number]);

    return (
        <button
            className={rootClass}
            onClick={handleClick}
            data-cy={isActive ? 'Tile-activeRoot' : 'Tile-root'}
        >
            {number}
        </button>
    );
};

Tile.propTypes = {
    classes: shape({
        root: string,
        root_active: string
    }),
    isActive: bool,
    number: number,
    onClick: func
};

export default Tile;
