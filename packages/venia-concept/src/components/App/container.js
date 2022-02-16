import React from 'react';
import { useErrorContext } from '@magento/peregrine/lib/context/unhandledErrors';
import { useErrorBoundary } from '@magento/venia-ui/lib/components/App/useErrorBoundary';
import App from './app';

const AppContainer = () => {
    const ErrorBoundary = useErrorBoundary(App);
    const [unhandledErrors, errorApi] = useErrorContext();

    return <ErrorBoundary unhandledErrors={unhandledErrors} {...errorApi} />;
};

export default AppContainer;
