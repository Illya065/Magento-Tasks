import React from 'react';

const ContentViewContext = React.createContext();

const ContentViewProvider = props => {
    const { value } = props;
    
    return (
        <ContentViewContext.Provider value={value}>
            {props.children}
        </ContentViewContext.Provider>
    );
};

export { ContentViewContext, ContentViewProvider };
