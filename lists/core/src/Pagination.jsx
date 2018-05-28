import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const generateUrl = (page, url, pageParamName) => {
    const finalUrl = url.replace(/(page=)[^&]+/, `${pageParamName}=${page}`);
    return finalUrl;
};

const propTypes = {
    perPage: PropTypes.number,
    currentPage: PropTypes.number,
    lastPage: PropTypes.number,
    url: PropTypes.string,
    pageParamName: PropTypes.string,
    showArrows: PropTypes.bool,
    onClickPage: PropTypes.func,
    onClickPrevious: PropTypes.func,
    onClickNext: PropTypes.func,
};

const defaultProps = {
    total: 0,
    perPage: 0,
    currentPage: 0,
    lastPage: 0,
    url: '',
    pageParamName: 'page',
    showArrows: true,
    onClickPage: null,
    onClickPrevious: null,
    onClickNext: null,
};

const linkPropTypes = {
    page: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    lastPage: PropTypes.number.isRequired,
    url: PropTypes.string,
    pageParamName: PropTypes.string,
    onClick: PropTypes.func,
};

/* eslint-disable react/default-props-match-prop-types */
const linkDefaultProps = {
    url: null,
    pageParamName: 'page',
    onClick: null,
};
/* eslint-enable react/default-props-match-prop-types */

const ArrowLink = ({
    type, currentPage, lastPage, url, pageParamName, onClick,
}) => {
    const isDisabled = type === 'previous' ? currentPage === 1 : currentPage === lastPage;
    let otherPage;
    if (type === 'previous') {
        otherPage = isDisabled ? lastPage : currentPage - 1;
    } else {
        otherPage = isDisabled ? 1 : currentPage + 1;
    }
    const onClickPrevious = !isDisabled ? e => onClick(e, otherPage) : null;
    const linkUrl = isDisabled ? '#' : generateUrl(otherPage, url, pageParamName);

    const itemClassNames = classNames({
        disabled: isDisabled,
    });

    return (
        <li className={itemClassNames}>
            <a href={linkUrl} onClick={onClickPrevious} aria-label="Previous">
                {type === 'previous' ? (
                    <span aria-hidden="true">&laquo;</span>
                ) : (
                    <span aria-hidden="true">&raquo;</span>
                )}
            </a>
        </li>
    );
};

ArrowLink.propTypes = {
    type: PropTypes.oneOf(['previous', 'next']).isRequired,
    ...linkPropTypes,
};
ArrowLink.defaultProps = linkDefaultProps;

const PageLinks = ({
    perPage, currentPage, lastPage, url, pageParamName, onClick,
}) => {
    const links = [];
    if (perPage && lastPage > perPage) {
        const middle = Math.floor(perPage / 2);
        let visibleStart = Math.max(1, currentPage - middle);
        // prettier-ignore
        const visibleEnd = Math.min(lastPage, (visibleStart + perPage) - 1);
        // prettier-ignore
        if (visibleEnd - visibleStart < perPage && visibleStart !== 1) {
            visibleStart = Math.max(1, (visibleEnd - perPage) + 1);
        }

        if (visibleStart > 1) {
            links.push(<PageLink
                key="page_1"
                page={1}
                currentPage={currentPage}
                url={url}
                pageParamName={pageParamName}
                onClick={onClick}
            />);
        }

        if (visibleStart - 1 > 1) {
            links.push(<PageDots key="dots_1" page={1} />);
        }

        for (let i = visibleStart; i <= visibleEnd; i += 1) {
            links.push(<PageLink
                key={`page_${i}`}
                page={i}
                currentPage={currentPage}
                url={url}
                pageParamName={pageParamName}
                onClick={onClick}
            />);
        }

        if (visibleEnd + 1 < lastPage) {
            links.push(<PageDots key={`dots_${lastPage}`} page={lastPage} />);
        }

        if (visibleEnd < lastPage) {
            links.push(<PageLink
                key={`page_${lastPage}`}
                page={lastPage}
                currentPage={currentPage}
                url={url}
                pageParamName={pageParamName}
                onClick={onClick}
            />);
        }
    } else {
        for (let ii = 1; ii <= lastPage; ii += 1) {
            links.push(<PageLink
                key={`page_${ii}`}
                page={ii}
                currentPage={currentPage}
                url={url}
                pageParamName={pageParamName}
                onClick={onClick}
            />);
        }
    }

    return links;
};

const PageLink = ({
    page, currentPage, url, pageParamName, onClick,
}) => {
    const linkUrl = generateUrl(page, url, pageParamName);
    const onClickPage = e => onClick(e, page);

    const itemClassNames = classNames({
        active: currentPage === page,
    });

    return (
        <li className={itemClassNames}>
            <a href={linkUrl} onClick={onClickPage}>
                {page}
            </a>
        </li>
    );
};

PageLink.propTypes = {
    ...linkPropTypes,
};
PageLink.defaultProps = linkDefaultProps;

const PageDots = (page) => {
    const key = `dots_${page}`;
    const itemClassNames = classNames({
        disabled: true,
    });

    /* eslint-disable jsx-a11y/anchor-is-valid */
    return (
        <li key={key} className={itemClassNames}>
            <a href="#">...</a>
        </li>
    );
    /* eslint-enable jsx-a11y/anchor-is-valid */
};

const Pagination = ({
    perPage,
    currentPage,
    lastPage,
    url,
    pageParamName,
    showArrows,
    onClickPage,
    onClickPrevious,
    onClickNext,
}) => {
    const listClassNames = classNames({
        pagination: true,
    });

    return (
        <nav>
            <ul className={listClassNames}>
                <ArrowLink
                    type="previous"
                    currentPage={currentPage}
                    lastPage={lastPage}
                    url={url}
                    pageParamName={pageParamName}
                    onClick={onClickPrevious}
                />
                {showArrows && (
                    <PageLinks
                        perPage={perPage}
                        currentPage={currentPage}
                        lastPage={lastPage}
                        url={url}
                        pageParamName={pageParamName}
                        onClick={onClickPage}
                    />
                )}
                {showArrows && (
                    <ArrowLink
                        type="next"
                        currentPage={currentPage}
                        lastPage={lastPage}
                        url={url}
                        pageParamName={pageParamName}
                        onClick={onClickNext}
                    />
                )}
            </ul>
        </nav>
    );
};

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default Pagination;
