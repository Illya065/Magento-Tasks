import React from 'react';
import { array } from 'prop-types';
import defaultClasses from './categoryList.module.css';
import { Link } from 'react-router-dom';

function CategoryList({ filters, urlList }) {
    if (filters && urlList) {
        const categoryFilter = filters.filter(
            item => item.label === 'Category'
        )[0].options;

        const categoryFilterWithUrl = categoryFilter.map(item => {
            const url = urlList.filter(
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
    urlList: array
};

export default CategoryList;
