import { PropTypes as PanneauPropTypes } from '@panneau/core';
import { ResourceProvider } from '@panneau/core/contexts';
import { useResourceUrlGenerator } from '@panneau/core/hooks';
import Alert from '@panneau/element-alert';
import { ResourceMessage } from '@panneau/intl';
import classNames from 'classnames';
import { parse as parseQuery, stringify as stringifyQuery } from 'query-string';
import React, { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import ResourceCreateButton from '../buttons/ResourceCreate';
import MainLayout from '../layouts/Main';
import ResourceItemsList from '../partials/ResourceItemsList';
import PageHeader from '../partials/PageHeader';

const propTypes = {
    resource: PanneauPropTypes.resource.isRequired,
};

const defaultProps = {};

const ResourceIndexPage = ({ resource }) => {
    const { name, settings = {} } = resource;
    const { canCreate = true, indexIsPaginated: paginated = false } = settings || {};

    const { search } = useLocation();
    const history = useHistory();
    const query = useMemo(() => parseQuery(search), [search]);
    const listQuery = useMemo(() => query, [query]); // TODO: omit routes
    const { created = false, deleted = false } = query || {};

    const resourceRoute = useResourceUrlGenerator(resource);
    const url = resourceRoute('index');
    const onQueryChange = useCallback(
        (submitQuery) => {
            history.push(
                `${url}?${stringifyQuery(submitQuery, {
                    arrayFormat: 'bracket',
                })}`,
            );
        },
        [history, url],
    );
    const onClickCloseAlert = useCallback(() => {
        history.replace(url);
    }, [history, url]);

    return (
        <ResourceProvider resource={resource}>
            <MainLayout>
                <PageHeader
                    title={name}
                    actions={
                        canCreate ? (
                            <ResourceCreateButton resource={resource} size="lg" theme="primary" />
                        ) : null
                    }
                />
                <div className={classNames(['container-sm py-4'])}>
                    {created ? (
                        <Alert className="mb-4" onClose={onClickCloseAlert}>
                            <ResourceMessage
                                resource={resource}
                                id="resources.created"
                                defaultMessage="{the_singular} has been created."
                                description="Alert message"
                            />
                        </Alert>
                    ) : null}
                    {deleted ? (
                        <Alert className="mb-4" onClose={onClickCloseAlert}>
                            <ResourceMessage
                                resource={resource}
                                id="resources.deleted"
                                defaultMessage="{the_singular} has been deleted."
                                description="Alert message"
                            />
                        </Alert>
                    ) : null}
                    <ResourceItemsList
                        resource={resource}
                        baseUrl={url}
                        query={listQuery}
                        paginated={paginated}
                        onQueryChange={onQueryChange}
                    />
                </div>
            </MainLayout>
        </ResourceProvider>
    );
};
ResourceIndexPage.propTypes = propTypes;
ResourceIndexPage.defaultProps = defaultProps;

export default ResourceIndexPage;
