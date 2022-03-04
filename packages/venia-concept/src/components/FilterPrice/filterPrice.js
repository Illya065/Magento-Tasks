/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Range } from 'rc-slider';
import { array, func, shape, string } from 'prop-types';
import setValidator from '@magento/peregrine/lib/validators/set';
import defaultClasses from './filterPrice.module.css';
import 'rc-slider/assets/index.css';
import './rc-slider.css';

const FilterPrice = props => {
    // VARIABLES (props)
    const { filterApi, group, items, onApply, filterState } = props;

    if (filterState) {
        console.log('filterState', Array.from(filterState)[0]);
    }

    const firstPriceItemValue = items[0].value;
    const lastPriceItemValue = items[items.length - 1].value;

    const minPrice = Number(firstPriceItemValue.split('_')[0]);
    const maxPrice = Number(lastPriceItemValue.split('_')[1]);

    const { toggleItem, removeItem } = filterApi;

    // STATE HOOKS
    const [priceRange, setPriceRange] = useState({
        min: minPrice,
        max: maxPrice
    });

    // EFFECT HOOKS
    useEffect(() => {
        if (filterState) {
            const filterMinPrice = Number(
                Array.from(filterState)[0].value.split('_')[0]
            );
            const filterMaxPrice = Number(
                Array.from(filterState)[0].value.split('_')[1]
            );

            const rangeSliderValueObject = {
                min: filterMinPrice,
                max: filterMaxPrice
            };
            setPriceRange(rangeSliderValueObject);
            console.log('filterPrice', filterMinPrice, filterMaxPrice);
        }
    }, []);

    // FUNCTIONS
    const rangeSliderValueChangeHandler = value => {
        const rangeSliderValueObject = {
            min: value[0],
            max: value[1]
        };

        setPriceRange(rangeSliderValueObject);
    };

    const inputPriceValueChangeHandler = e => {
        const priceValue = Number(e.target.value);
        const isNumber = typeof priceValue === 'number' && isFinite(priceValue);

        if (e.target.id === 'less-price-value' && isNumber) {
            setPriceRange({ ...priceRange, min: priceValue });
        }

        if (e.target.id === 'greater-price-value' && isNumber) {
            setPriceRange({ ...priceRange, max: priceValue });
        }
    };

    const correctPriceRange = () => {
        return {
            min:
                priceRange.min < priceRange.max
                    ? priceRange.min
                    : priceRange.max,
            max:
                priceRange.max > priceRange.min
                    ? priceRange.max
                    : priceRange.min
        };
    };

    const applyPriceFilter = () => {
        const correctedPriceRange = correctPriceRange();

        const item = {
            title: `${correctedPriceRange.min}-${correctedPriceRange.max}`,
            value: `${correctedPriceRange.min}_${correctedPriceRange.max}`
        };

        removeItem(group);
        toggleItem({ group, item });
        // setItems({ group, item });

        if (typeof onApply === 'function') {
            onApply(group, item);
        }
    };

    return (
        <div>
            <div className={defaultClasses.inputsWrapper}>
                <input
                    onChange={inputPriceValueChangeHandler}
                    className={defaultClasses.priceValueInput}
                    type="text"
                    value={priceRange.min}
                    id="less-price-value"
                    onBlur={applyPriceFilter}
                />
                <input
                    onChange={inputPriceValueChangeHandler}
                    className={defaultClasses.priceValueInput}
                    type="text"
                    value={priceRange.max}
                    id="greater-price-value"
                    onBlur={applyPriceFilter}
                />
            </div>

            <Range
                min={minPrice}
                max={maxPrice}
                onAfterChange={applyPriceFilter}
                onChange={rangeSliderValueChangeHandler}
                value={[priceRange.min, priceRange.max]}
            />
        </div>
    );
};

FilterPrice.propTypes = {
    filterApi: shape({}).isRequired,
    group: string,
    items: array,
    onApply: func,
    filterState: setValidator
};

export default FilterPrice;
