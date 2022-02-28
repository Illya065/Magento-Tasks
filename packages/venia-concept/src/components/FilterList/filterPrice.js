/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Range } from 'rc-slider';
import defaultClasses from './filterPrice.module.css';
import 'rc-slider/assets/index.css';
import './rc-slider.css';
import { array, func, shape, string } from 'prop-types';

const FilterPrice = props => {
    // VARIABLES (props)
    const { filterApi, group, items, onApply } = props;

    const firstPriceItemValue = items[0].value;
    const lastPriceItemValue = items[items.length - 1].value;

    const minPrice = Number(firstPriceItemValue.split('_')[0]);
    const maxPrice = Number(lastPriceItemValue.split('_')[1]);

    const { toggleItem } = filterApi;

    // STATE HOOKS
    const [priceRange, setPriceRange] = useState({
        min: 0,
        max: 0
    });

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

        toggleItem({ group, item });

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
    onApply: func
};

export default FilterPrice;
