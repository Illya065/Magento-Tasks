import React from 'react';
import defaultClasses from './commentsPage.module.css';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { Redirect } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const CommentsPage = () => {
    // VARIABLES
    const [{ isSignedIn }] = useUserContext();
    const redirect = isSignedIn ? null : <Redirect to={'/'} />;
    const title = (
        <FormattedMessage id={'commentsPage.title'} defaultMessage={'Comments Page'} />
    );

    return (
        <div>
            {redirect}
            <h3 className={defaultClasses.pageTitle}>{title}</h3>
        </div>
    );
};

export default CommentsPage;
