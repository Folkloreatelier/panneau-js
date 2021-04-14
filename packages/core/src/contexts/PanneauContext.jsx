/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import * as PanneauPropTypes from '../lib/PropTypes';

const PanneauContext = React.createContext(null);

export const usePanneau = () => useContext(PanneauContext);

export const usePanneauResources = () => {
    const { resources = [] } = usePanneau();
    return resources;
};

export const usePanneauResource = (id) => {
    const resources = usePanneauResources();
    return resources.find((it) => it.id === id) || null;
};

const propTypes = {
    definition: PanneauPropTypes.panneauDefinition.isRequired,
    children: PropTypes.node.isRequired,
};

const defaultProps = {};

export const PanneauProvider = ({ definition, children }) => (
    <PanneauContext.Provider value={definition}>{children}</PanneauContext.Provider>
);

PanneauProvider.propTypes = propTypes;
PanneauProvider.defaultProps = defaultProps;

export default PanneauContext;