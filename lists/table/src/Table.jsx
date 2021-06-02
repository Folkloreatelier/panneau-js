/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { stringify as stringifyQuery } from 'query-string';

// import { defineMessages } from 'react-intl';

import { PropTypes as PanneauPropTypes } from '@panneau/core';
import { useDisplaysComponents } from '@panneau/core/contexts';
// import { useResourceUrlGenerator } from '@panneau/core/hooks';
import { getComponent, getComponentFromName, getColumnsFromResource } from '@panneau/core/utils';

import Pagination from '@panneau/element-pagination';
import Loading from '@panneau/element-loading';
import FormActions from '@panneau/element-item-actions';

const propTypes = {
    resource: PanneauPropTypes.resource.isRequired,
    items: PanneauPropTypes.items,
    query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    page: PropTypes.number,
    lastPage: PropTypes.number,
    total: PropTypes.number,
    baseUrl: PropTypes.string,
    theme: PropTypes.string,
    // onQueryChange: PropTypes.func,
};

const defaultProps = {
    items: [],
    query: null,
    page: null,
    lastPage: null,
    total: null,
    baseUrl: null,
    theme: null,
    // onQueryChange: null,
};

const TableList = ({
    query,
    resource,
    items,
    page,
    lastPage,
    total,
    baseUrl,
    theme,
    // onQueryChange,
}) => {
    const displayComponents = useDisplaysComponents();

    const { page: queryPage, ...queryWithoutPage } = query || {};
    const hasQuery = Object.keys(queryWithoutPage).length > 0;
    const { settings: { indexIsPaginated: paginated = false } = {} } = resource;

    const columns = useMemo(() => getColumnsFromResource(resource), [resource]);

    const currentUrl = `${baseUrl}${
        hasQuery
            ? `?${stringifyQuery(queryWithoutPage, {
                  arrayFormat: 'bracket',
              })}`
            : ''
    }`;

    return (
        <div>
            {paginated && lastPage > 1 && items !== null ? (
                <Pagination
                    page={page}
                    lastPage={lastPage}
                    total={total}
                    url={currentUrl}
                    className="mt-1 mb-3"
                />
            ) : null}
            {items !== null ? (
                <table
                    className={classNames([
                        'table',
                        'table-sm',
                        'table-hover',
                        'align-middle',
                        'mb-0',
                        { [`table-${theme}`]: theme !== null },
                    ])}
                >
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            {columns.map(({ name, label }) => (
                                <th scope="col" key={`col-${name}`}>
                                    {label}
                                </th>
                            ))}
                            <th scope="col">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((it) => {
                            const { id = null } = it || {};
                            return (
                                <tr key={`row-${id}`}>
                                    <td className="col-auto">{id}</td>
                                    {columns.map((column) => {
                                        const {
                                            id: colId,
                                            component = 'text',
                                            valueKey = null,
                                            field = null,
                                            ...fieldProps
                                        } = column;

                                        const { name: componentName, props: componentProps } =
                                            getComponent(component);
                                        const FieldIndexComponent = getComponentFromName(
                                            componentName,
                                            displayComponents,
                                            'text',
                                        );

                                        return (
                                            <td className="col-auto" key={`row-${id}-${colId}`}>
                                                {FieldIndexComponent !== null ? (
                                                    <FieldIndexComponent
                                                        {...componentProps}
                                                        {...fieldProps}
                                                        field={field}
                                                        value={
                                                            valueKey !== null
                                                                ? it[valueKey] || null
                                                                : it[id] || null
                                                        }
                                                    />
                                                ) : null}
                                            </td>
                                        );
                                    })}
                                    <td className="text-end col-auto">
                                        <FormActions resource={resource} item={it} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <Loading>Loading</Loading>
            )}
            {paginated && lastPage > 1 && items !== null ? (
                <Pagination
                    page={page}
                    lastPage={lastPage}
                    total={total}
                    url={currentUrl}
                    className="mt-4"
                    withCount
                />
            ) : null}
        </div>
    );
};

TableList.propTypes = propTypes;
TableList.defaultProps = defaultProps;

export default TableList;
