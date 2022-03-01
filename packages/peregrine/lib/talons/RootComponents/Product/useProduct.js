import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '../../../util/shallowMerge';
import DEFAULT_OPERATIONS from './product.gql';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Product Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {Function}    props.mapProduct - A function for updating products to the proper shape.
 * @param {GraphQLAST}  props.queries.getStoreConfigData - Fetches storeConfig product url suffix using a server query
 * @param {GraphQLAST}  props.queries.getProductQuery - Fetches product using a server query
 *
 * @returns {object}    result
 * @returns {Bool}      result.error - Indicates a network error occurred.
 * @returns {Bool}      result.loading - Indicates the query is in flight.
 * @returns {Bool}      result.product - The product's details.
 */
export const useProduct = props => {
    const { mapProduct } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getStoreConfigData, getProductDetailQuery } = operations;
    const { pathname } = useLocation();
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const slug = pathname.split('/').pop();
    const productUrlSuffix = storeConfigData?.storeConfig?.product_url_suffix;
    const urlKey = productUrlSuffix ? slug.replace(productUrlSuffix, '') : slug;

    const { error, loading, data } = useQuery(getProductDetailQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            urlKey
        }
    });

    const isBackgroundLoading = !!data && loading;

    const productData = useMemo(() => {
        if (!data) {
            // The product isn't in the cache and we don't have a response from GraphQL yet.
            return null;
        }

        // Note: if a product is out of stock _and_ the backend specifies not to
        // display OOS items, the items array will be empty.

        // Only return the product that we queried for.
        const product = data.products.items.find(
            item => item.url_key === urlKey
        );

        if (!product) {
            return null;
        }

        return mapProduct(product);
    }, [data, mapProduct, urlKey]);

    const configurableOptions = productData.configurable_options.map(item => {
        if (item.attribute_id === '138') {
            const newValue = item.values.map(valueItem => {
                const isNotModified = valueItem.label.split('').includes('_');
                const labelName = isNotModified
                    ? valueItem.label.split('_')[1]
                    : valueItem.label;
                return {
                    ...valueItem,
                    default_label: labelName,
                    label: labelName,
                    store_label: labelName
                };
            });

            return {
                ...item,
                values: newValue
            };
        } else {
            return item;
        }
    });

    const product = JSON.parse(JSON.stringify(productData));
    product.configurable_options = configurableOptions;

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    return {
        error,
        loading,
        product
    };
};
