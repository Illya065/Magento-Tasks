/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef } from 'react';
import { string, shape, array } from 'prop-types';

import GalleryItem from './item';
import { GalleryItemShimmer } from '@magento/venia-ui/lib/components/Gallery';
import defaultClasses from '@magento/venia-ui/lib/components/Gallery/gallery.module.css';
import customClasses from './gallery.module.css';
import { useGallery } from '@magento/peregrine/lib/talons/Gallery/useGallery';
import { useStyle } from '@magento/venia-ui/lib/classify';

/**
 * Renders a Gallery of items. If items is an array of nulls Gallery will render
 * a placeholder item for each.
 *
 * @params {Array} props.items an array of items to render
 */
const Gallery = props => {
    const { items, view } = props;
    const classes = useStyle(defaultClasses, props.classes, customClasses);
    const talonProps = useGallery();
    const { storeConfig } = talonProps;

    const contentRef = useRef(null);

    useEffect(() => {
        if (view === 'list') {
            contentRef.current.classList.add(classes.list);
        } else {
            contentRef.current.classList.remove(classes.list);
        }
    }, [view]);

    const galleryItems = useMemo(
        () =>
            items.map((item, index) => {
                if (item === null) {
                    return <GalleryItemShimmer key={index} />;
                }
                return (
                    <div>
                        <GalleryItem
                            key={item.id}
                            item={item}
                            storeConfig={storeConfig}
                        />
                    </div>
                );
            }),
        [items, storeConfig]
    );

    return (
        <div
            data-cy="Gallery-root"
            className={classes.root}
            aria-live="polite"
            aria-busy="false"
        >
            <div ref={contentRef} className={classes.items}>
                {galleryItems}
            </div>
        </div>
    );
};

Gallery.propTypes = {
    classes: shape({
        filters: string,
        items: string,
        pagination: string,
        root: string
    }),
    items: array.isRequired,
    view: string
};

export default Gallery;
