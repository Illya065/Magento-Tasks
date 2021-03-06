import React from 'react';
import { arrayOf, shape, string, func, bool } from 'prop-types';
import { useIntl } from 'react-intl';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import { Form } from 'informed';

import { useFilterBlock } from '@magento/peregrine/lib/talons/FilterModal';
import setValidator from '@magento/peregrine/lib/validators/set';
import Icon from '@magento/venia-ui/lib/components/Icon';
import FilterList from '@magento/venia-ui/lib/components/FilterModal/FilterList';
import defaultClasses from '@magento/venia-ui/lib/components/FilterModal/filterBlock.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

import FilterPrice from '../FilterPrice';
import FilterColor from '../FilterColor';

const FilterBlock = props => {
    // PROPS
    const {
        filterApi,
        filterState,
        group,
        items,
        name,
        onApply,
        initialOpen
    } = props;

    // CUSTOM HOOKS
    const { formatMessage } = useIntl();
    const talonProps = useFilterBlock({
        filterState,
        items,
        initialOpen
    });
    const classes = useStyle(defaultClasses, props.classes);

    // VARIABLES
    const { handleClick, isExpanded } = talonProps;
    const iconSrc = isExpanded ? ArrowUp : ArrowDown;
    const itemAriaLabel = formatMessage(
        {
            id: 'filterModal.item.ariaLabel',
            defaultMessage: 'Filter products by "{itemName}"'
        },
        {
            itemName: name
        }
    );
    const toggleItemOptionsAriaLabel = isExpanded
        ? formatMessage(
              {
                  id: 'filterModal.item.hideOptions',
                  defaultMessage: 'Hide "{itemName}" filter item options.'
              },
              {
                  itemName: name
              }
          )
        : formatMessage(
              {
                  id: 'filterModal.item.showOptions',
                  defaultMessage: 'Show "{itemName}" filter item options.'
              },
              {
                  itemName: name
              }
          );

    // COMPONENTS
    const listItem =
        name === 'Price' ? (
            <FilterPrice
                filterApi={filterApi}
                group={group}
                items={items}
                onApply={onApply}
                filterState={filterState}
            />
        ) : name === 'Fashion Color' ? (
            <FilterColor
                filterApi={filterApi}
                group={group}
                items={items}
                onApply={onApply}
                filterState={filterState}
            />
        ) : (
            <FilterList
                filterApi={filterApi}
                filterState={filterState}
                group={group}
                items={items}
                onApply={onApply}
            />
        );

    const list = isExpanded ? (
        <Form className={classes.list}>{listItem}</Form>
    ) : null;

    return (
        <li
            className={classes.root}
            aria-label={itemAriaLabel}
            data-cy="FilterBlock-root"
        >
            <button
                className={classes.trigger}
                onClick={handleClick}
                data-cy="FilterBlock-triggerButton"
                type="button"
                aria-expanded={isExpanded}
                aria-label={toggleItemOptionsAriaLabel}
            >
                <span className={classes.header}>
                    <span className={classes.name}>{name}</span>
                    <Icon src={iconSrc} />
                </span>
            </button>
            {list}
        </li>
    );
};

FilterBlock.defaultProps = {
    onApply: null,
    initialOpen: false
};

FilterBlock.propTypes = {
    classes: shape({
        header: string,
        list: string,
        name: string,
        root: string,
        trigger: string
    }),
    filterApi: shape({}).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    items: arrayOf(shape({})),
    name: string.isRequired,
    onApply: func,
    initialOpen: bool
};

export default FilterBlock;
