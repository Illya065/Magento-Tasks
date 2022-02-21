import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';

/**
 * A component that renders a logo in the header.
 *
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a logo.
 */
const Logo = props => {
    const classes = useStyle({}, props.classes);
    const { formatMessage } = useIntl();

    const title = formatMessage({ id: 'logo.title', defaultMessage: 'Venia' });

    const {
        currentLogoSource,
        currentLogoWidth = 176,
        currentLogoHeight = 46
    } = useStoreSwitcher();

    return (
        <Image
            alt={title}
            classes={{ image: classes.logo }}
            height={currentLogoHeight}
            src={`https://magento-template/media/logo/${currentLogoSource}`}
            title={title}
            width={currentLogoWidth}
        />
    );
};

/**
 * Props for the Logo component.
 *
 * @kind props
 *
 * @property {Object} classes An object containing the class names for the Logo component.
 * @property {string} classes.logo Classes for logo
 * @property {number} [height=18] Height of the logo.
 * @property {number} [width=102] Width of the logo.
 */
Logo.propTypes = {
    classes: PropTypes.shape({
        logo: PropTypes.string
    }),
    height: PropTypes.number,
    width: PropTypes.number
};

Logo.defaultProps = {
    height: 18,
    width: 102
};

export default Logo;