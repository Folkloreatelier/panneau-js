import React from 'react';

// import { PropTypes as PanneauPropTypes } from '@panneau/core';

import MainLayout from '../layouts/Main';

const propTypes = {};

const defaultProps = {};

const HomePage = () => (
    <MainLayout>
        <div className="container-sm">Panneau home</div>
    </MainLayout>
);
HomePage.propTypes = propTypes;
HomePage.defaultProps = defaultProps;

export default HomePage;
