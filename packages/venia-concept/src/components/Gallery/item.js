/* eslint-disable react/jsx-no-literals */
import React, { useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Info } from 'react-feather';
import { string, number, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import Price from '@magento/venia-ui/lib/components/Price';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import Image from '@magento/venia-ui/lib/components/Image';
import { GalleryItemShimmer } from '@magento/venia-ui/lib/components/Gallery';
import defaultClasses from '@magento/venia-ui/lib/components/Gallery/item.module.css';
import customClasses from './item.module.css';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';

import { useStyle } from '@magento/venia-ui/lib/classify';
import AddToCartButton from './addToCartButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import QuickView from '../QuickView';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';
import { useProduct } from '../RootComponents/Product/useProduct';
import { ContentViewContext } from '../Category/contentViewContext';

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(640, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {
    // CUSTOM HOOKS
    const {
        handleLinkClick,
        item,
        wishlistButtonProps,
        isSupportedProductType
    } = useGalleryItem(props);

    const { product } = useProduct({
        mapProduct,
        url: item.url_key
    });

    // VARIABLES
    const { storeConfig } = props;
    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;
    const classes = useStyle(defaultClasses, props.classes, customClasses);
    const { name, product_brand, price_range, small_image, url_key } = item;
    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);
    const ratingAverage = null;
    const view = useContext(ContentViewContext);

    // STATE HOOKS
    const [dialog, setDialog] = useState(false);

    // FUNCTIONS
    const handleDialogModalVisibility = () => {
        setDialog(!dialog);
    };

    // COMPONENTS
    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const wishlistButton = wishlistButtonProps ? (
        <WishlistGalleryButton {...wishlistButtonProps} />
    ) : null;

    const addButton = isSupportedProductType ? (
        <AddToCartButton item={item} urlSuffix={productUrlSuffix} />
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'galleryItem.unavailableProduct'}
                    defaultMessage={'Currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    const quickViewButton = product ? (
        <button
            className={classes.quickViewButton}
            onClick={handleDialogModalVisibility}
        >
            <FontAwesomeIcon height={20} icon={faEye} width={20} />
        </button>
    ) : null;

    return (
        <>
            <div
                data-cy="GalleryItem-root"
                className={classes.root}
                aria-live="polite"
                aria-busy="false"
            >
                {dialog ? (
                    <QuickView
                        product={product}
                        closeModal={handleDialogModalVisibility}
                    />
                ) : null}

                <Link
                    onClick={handleLinkClick}
                    to={productLink}
                    className={classes.images}
                >
                    <Image
                        alt={name}
                        classes={{
                            image: classes.image,
                            loaded: classes.imageLoaded,
                            notLoaded: classes.imageNotLoaded,
                            root: classes.imageContainer
                        }}
                        height={IMAGE_HEIGHT}
                        resource={smallImageURL}
                        widths={IMAGE_WIDTHS}
                    />
                    {ratingAverage}
                </Link>
                <div className={view === 'list' ? classes.itemInfoList : ''}>
                    <Link
                        onClick={handleLinkClick}
                        to={productLink}
                        className={classes.name}
                        data-cy="GalleryItem-name"
                    >
                        <span>{name}</span>
                    </Link>
                    {product_brand ? (
                        <div className="brand">
                            <FormattedMessage
                                id={'glabal.brand'}
                                defaultMessage={'Brand'}
                            />
                            <span>{`: ${product_brand}`}</span>
                        </div>
                    ) : null}

                    <div data-cy="GalleryItem-price" className={classes.price}>
                        <Price
                            value={
                                price_range.maximum_price.regular_price.value
                            }
                            currencyCode={
                                price_range.maximum_price.regular_price.currency
                            }
                        />
                    </div>

                    <div className={classes.actionsContainer}>
                        {addButton}
                        {wishlistButton}
                        {quickViewButton}
                    </div>
                </div>
            </div>
        </>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        stock_status: string.isRequired,
        __typename: string.isRequired,
        url_key: string.isRequired,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                regular_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string.isRequired
    })
};

export default GalleryItem;
