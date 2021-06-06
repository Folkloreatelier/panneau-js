/* eslint-disable react/no-array-index-key, react/jsx-props-no-spreading */
import Link from '@panneau/element-link';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

const propTypes = {
    page: PropTypes.number,
    lastPage: PropTypes.number,
    total: PropTypes.number,
    url: PropTypes.string,
    withPreviousNext: PropTypes.bool,
    withCount: PropTypes.bool,
    align: PropTypes.oneOf(['left', 'right']),
    previousLabel: PropTypes.node,
    nextLabel: PropTypes.node,
    countLabel: PropTypes.node,
    className: PropTypes.string,
    paginationClassName: PropTypes.string,
    itemClassName: PropTypes.string,
    linkClassName: PropTypes.string,
    onClickPage: PropTypes.func,
};

const defaultProps = {
    page: 1,
    lastPage: 1,
    total: null,
    url: null,
    withPreviousNext: false,
    withCount: false,
    align: 'right',
    previousLabel: (
        <FormattedMessage defaultMessage="Previous" description="Pagination button label" />
    ),
    nextLabel: <FormattedMessage defaultMessage="Next" description="Pagination button label" />,
    countLabel: (
        <FormattedMessage
            defaultMessage="{count, plural, =0 {No item.} =1 {# item} other {# items}}"
            description="Pagination count label"
        />
    ),
    className: null,
    paginationClassName: null,
    itemClassName: null,
    linkClassName: null,
    onClickPage: null,
};

const PaginationMenu = ({
    page,
    lastPage,
    total,
    url,
    withPreviousNext,
    withCount,
    align,
    previousLabel,
    nextLabel,
    countLabel,
    className,
    paginationClassName,
    itemClassName,
    linkClassName,
    onClickPage,
}) => {
    const getUrl = useCallback(
        (currentPage) =>
            url !== null
                ? `${url}${
                      url.indexOf('?') !== -1 ? `&page=${currentPage}` : `?page=${currentPage}`
                  }`
                : null,
        [url],
    );
    const pages = [...Array(lastPage).keys()].map((it, idx) => idx + 1);

    return (
        <nav
            className={classNames([
                'd-flex',
                'align-items-center',
                'm-0',
                {
                    'justify-content-end': align === 'right',
                    [className]: className !== null,
                },
            ])}
        >
            {total !== null && withCount && align === 'right' ? (
                <div className="mx-3 text-muted">
                    {React.cloneElement(countLabel, {
                        values: { count: total },
                    })}
                </div>
            ) : null}
            <ul
                className={classNames([
                    'pagination',
                    'm-0',
                    {
                        [paginationClassName]: paginationClassName !== null,
                    },
                ])}
            >
                {withPreviousNext ? (
                    <li
                        className={classNames([
                            'page-item',
                            {
                                disabled: page <= 1,
                                [itemClassName]: itemClassName !== null,
                            },
                        ])}
                    >
                        {page > 1 ? (
                            <Link
                                className={classNames([
                                    'page-link',
                                    {
                                        [linkClassName]: linkClassName !== null,
                                    },
                                ])}
                                href={getUrl(page - 1)}
                                onClick={onClickPage !== null ? () => onClickPage(page - 1) : null}
                            >
                                {previousLabel}
                            </Link>
                        ) : (
                            <span
                                className={classNames([
                                    'page-link',
                                    {
                                        [linkClassName]: linkClassName !== null,
                                    },
                                ])}
                            >
                                {previousLabel}
                            </span>
                        )}
                    </li>
                ) : null}

                {pages.map((pageNumber) => (
                    <li
                        key={`page-${pageNumber}`}
                        className={classNames([
                            'page-item',
                            {
                                active: pageNumber === page,
                                [itemClassName]: itemClassName !== null,
                            },
                        ])}
                    >
                        <Link
                            className={classNames([
                                'page-link',
                                {
                                    [linkClassName]: linkClassName !== null,
                                },
                            ])}
                            href={getUrl(pageNumber)}
                            onClick={onClickPage !== null ? () => onClickPage(pageNumber) : null}
                        >
                            {pageNumber}
                        </Link>
                    </li>
                ))}

                {withPreviousNext ? (
                    <li
                        className={classNames([
                            'page-item',
                            {
                                disabled: page >= lastPage,
                                [itemClassName]: itemClassName !== null,
                            },
                        ])}
                    >
                        {page < lastPage ? (
                            <Link
                                className={classNames([
                                    'page-link',
                                    {
                                        [linkClassName]: linkClassName !== null,
                                    },
                                ])}
                                href={getUrl(page + 1)}
                                onClick={onClickPage !== null ? () => onClickPage(page + 1) : null}
                            >
                                {nextLabel}
                            </Link>
                        ) : (
                            <span
                                className={classNames([
                                    'page-link',
                                    {
                                        [linkClassName]: linkClassName !== null,
                                    },
                                ])}
                            >
                                {nextLabel}
                            </span>
                        )}
                    </li>
                ) : null}
            </ul>
            {total !== null && withCount && align === 'left' ? (
                <div className="mx-3 text-muted">
                    {React.cloneElement(countLabel, {
                        values: { count: total },
                    })}
                </div>
            ) : null}
        </nav>
    );
};

PaginationMenu.propTypes = propTypes;
PaginationMenu.defaultProps = defaultProps;

export default PaginationMenu;
