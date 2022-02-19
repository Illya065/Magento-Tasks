/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Suspense, useEffect } from 'react';
import Portal from '../Portal';
import PropTypes from 'prop-types';
import { Form } from 'informed';
import { Info } from 'react-feather';
import customClasses from './quickView.module.css';
import productFullDetailsClasses from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.module.css';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import Options from '@magento/venia-ui/lib/components/ProductOptions/options';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/Button';
import { useToasts } from '@magento/peregrine';

const QuickView = props => {
    // VARIABLES
    const { closeModal, product } = props;
    const aviability = `Aviability: ${product.stock_status}`;
    const price = `${product.price.regularPrice.amount.value} ${
        product.price.regularPrice.amount.currency
    }`;
    const classes = useStyle(customClasses, productFullDetailsClasses);

    // CUSTOM HOOKS
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    let talonProps = null;
    if (product) {
        talonProps = useProductFullDetail({ product });
    }
    const {
        errorMessage,
        handleAddToCart,
        isAddToCartDisabled,
        isOutOfStock,
        isSupportedProductType,
        mediaGalleryEntries
    } = talonProps;

    // EFFECT HOOKS
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => (document.body.style.overflow = 'unset');
    }, []);

    // FUNCTIONS
    const stopPropagation = e => {
        e.stopPropagation();
    };

    const handleButtonPress = formData => {
        handleAddToCart(formData);
        addToast({
            message: formatMessage(
                {
                    defaultMessage: 'You added product to your shopping cart',
                    id: 'productFullDetail.success'
                },
                { name: product.name }
            ),
            onDismiss: remove => remove(),
            timeout: 5000,
            type: 'success'
        });
    };

    // COMPONENTS
    const cartCallToActionText = !isOutOfStock ? (
        <FormattedMessage
            id="productFullDetail.addItemToCart"
            defaultMessage="Add to Cart"
        />
    ) : (
        <FormattedMessage
            id="productFullDetail.itemOutOfStock"
            defaultMessage="Out of Stock"
        />
    );

    const closeButton = (
        <button className={classes.closeButton} onClick={closeModal} />
    );

    const cartActionContent = isSupportedProductType ? (
        <Button
            data-cy="ProductFullDetail-addToCartButton"
            disabled={isAddToCartDisabled}
            priority="high"
            type="submit"
        >
            {cartCallToActionText}
        </Button>
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'productFullDetail.unavailableProduct'}
                    defaultMessage={
                        'This product is currently unavailable for purchase.'
                    }
                />
            </p>
        </div>
    );

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options
                onSelectionChange={talonProps.handleSelectionChange}
                options={product.configurable_options}
            />
        </Suspense>
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage:
                            'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    return (
        <Portal container={document.body}>
            <div onClick={closeModal} className={classes.modal}>
                <div onClick={stopPropagation} className={classes.content}>
                    {closeButton}
                    <div className={classes.imageBlock}>
                        <section className={classes.imageCarousel}>
                            <Carousel images={mediaGalleryEntries} />
                        </section>
                    </div>

                    <Form
                        className={classes.descriptionBlock}
                        data-cy="ProductFullDetail-root"
                        onSubmit={handleButtonPress}
                    >
                        <h1 className={classes.name}>{product.name}</h1>

                        <section className={classes.aviability}>
                            <p>{aviability}</p>
                        </section>

                        <section className={classes.price}>
                            <p>{price}</p>
                        </section>

                        <section className={classes.productOptions}>
                            {options}
                        </section>

                        <section className={classes.productQuantity}>
                            <span
                                data-cy="ProductFullDetail-quantityTitle"
                                className={classes.quantityTitle}
                            >
                                <FormattedMessage
                                    id={'global.quantity'}
                                    defaultMessage={'Quantity'}
                                />
                            </span>
                            <QuantityFields
                                classes={{ root: classes.quantityRoot }}
                                min={1}
                                message={errors.get('quantity')}
                            />
                        </section>
                        <section>{cartActionContent}</section>
                    </Form>
                </div>
            </div>
        </Portal>
    );
};

QuickView.propTypes = {
    closeModal: PropTypes.func,
    product: PropTypes.object
};

export default QuickView;
