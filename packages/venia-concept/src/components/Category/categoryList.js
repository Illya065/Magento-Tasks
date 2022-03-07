import React from 'react';
import { Link } from 'react-router-dom';
import { array } from 'prop-types';

import defaultClasses from './categoryList.module.css';

function CategoryList({ filters, categoryUrlList }) {
    if (filters && categoryUrlList) {
        // get categories list from filters (without url, only name and value)
        const categoryFilter = filters.filter(
            item => item.label === 'Category'
        )[0].options;

        // add url property
        const categoryFilterWithUrl = categoryFilter.map(item => {
            const url = categoryUrlList.filter(
                filterItem => filterItem.name === item.label
            )[0].url;

            return {
                ...item,
                url
            };
        });

        return (
            <ul className={defaultClasses.categoryList}>
                {categoryFilterWithUrl.map((item, index) => (
                    <li className={defaultClasses.categoryListItem} key={index}>
                        <Link to={`/${item.url}.html`}>{item.label}</Link>
                    </li>
                ))}
            </ul>
        );
    }

    return null;
}

CategoryList.propTypes = {
    filters: array,
    categoryUrlList: array
};

export default CategoryList;
