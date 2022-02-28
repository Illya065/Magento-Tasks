import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { shape, string, func } from 'prop-types';
import { X as Remove } from 'react-feather';

import Icon from '@magento/venia-ui/lib/components/Icon';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import defaultClasses from '@magento/venia-ui/lib/components/FilterModal/CurrentFilters/currentFilter.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const CurrentFilter = props => {
    const { group, item, removeItem, onRemove } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const handleClick = useCallback(() => {
        removeItem({ group, item });
        if (typeof onRemove === 'function') {
            onRemove(group, item);
        }
    }, [group, item, removeItem, onRemove]);

    const ariaLabel = formatMessage(
        {
            id: 'filterModal.action.clearFilterItem.ariaLabel',
            defaultMessage: 'Clear filter "{name}"'
        },
        {
            name: item.title
        }
    );

    return (
        <span className={classes.root} data-cy="CurrentFilter-root">
            <Trigger
                action={handleClick}
                ariaLabel={ariaLabel}
                data-cy="CurrentFilter-trigger"
            >
                <Icon size={20} src={Remove} />
            </Trigger>
            <span className={classes.text}>{item.title}</span>
        </span>
    );
};

export default CurrentFilter;

CurrentFilter.defaultProps = {
    onRemove: null
};

CurrentFilter.propTypes = {
    classes: shape({
        root: string
    }),
    onRemove: func
};
