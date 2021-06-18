/* eslint-disable react/jsx-props-no-spreading */
import { PropTypes as PanneauPropTypes } from '@panneau/core';
import {
    ComponentsProvider,
    PanneauProvider,
    RoutesProvider,
    UppyProvider,
} from '@panneau/core/contexts';
import { ApiProvider } from '@panneau/data';
import DisplaysProvider from '@panneau/displays';
import FieldsProvider from '@panneau/fields';
import FiltersProvider from '@panneau/filters';
import FormsProvider from '@panneau/forms';
import { IntlProvider } from '@panneau/intl';
import ListsProvider from '@panneau/lists';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { MemoryRouter } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/styles.scss';
import Routes from './Routes';

const propTypes = {
    definition: PanneauPropTypes.panneauDefinition.isRequired,
    components: PropTypes.oneOfType([
        PropTypes.objectOf(PropTypes.elementType),
        PropTypes.objectOf(PropTypes.objectOf(PropTypes.elementType)),
    ]),
    user: PanneauPropTypes.user,
    memoryRouter: PropTypes.bool,
    baseUrl: PropTypes.string,
    uppy: PanneauPropTypes.uppy,
    statusCode: PanneauPropTypes.statusCode,
};

const defaultProps = {
    components: null,
    user: null,
    memoryRouter: false,
    baseUrl: null,
    uppy: null,
    statusCode: null,
};

const Container = ({ definition, components, user, memoryRouter, baseUrl, uppy, statusCode }) => {
    const {
        intl: { locale = 'en', locales = [] } = {},
        routes = {},
        settings: { memoryRouter: usesMemoryRouter = false } = {},
    } = definition;
    const Router = memoryRouter || usesMemoryRouter ? MemoryRouter : BrowserRouter;
    const extraMessages = useMemo(() => {
        const { intl: { messages = null } = {}, resources = [] } = definition;
        return {
            ...messages,
            ...resources.reduce(
                (allMessages, { id, intl: { messages: resourceMessages = {} } = {} }) => ({
                    ...allMessages,
                    ...Object.keys(resourceMessages).reduce(
                        (allResourceMessages, key) => ({
                            ...allResourceMessages,
                            [`resources.${id}.${key}`]: resourceMessages[key],
                        }),
                        {},
                    ),
                }),
                {},
            ),
        };
    }, [definition]);

    return (
        <Router>
            <IntlProvider locale={locale} locales={locales} extraMessages={extraMessages}>
                <PanneauProvider definition={definition}>
                    <UppyProvider {...uppy}>
                        <RoutesProvider routes={routes}>
                            <FieldsProvider>
                                <FormsProvider>
                                    <ListsProvider>
                                        <DisplaysProvider>
                                            <FiltersProvider>
                                                <ApiProvider baseUrl={baseUrl}>
                                                    <AuthProvider user={user}>
                                                        <ComponentsProvider components={components}>
                                                            <Routes statusCode={statusCode} />
                                                        </ComponentsProvider>
                                                    </AuthProvider>
                                                </ApiProvider>
                                            </FiltersProvider>
                                        </DisplaysProvider>
                                    </ListsProvider>
                                </FormsProvider>
                            </FieldsProvider>
                        </RoutesProvider>
                    </UppyProvider>
                </PanneauProvider>
            </IntlProvider>
        </Router>
    );
};

Container.propTypes = propTypes;
Container.defaultProps = defaultProps;

export default Container;
