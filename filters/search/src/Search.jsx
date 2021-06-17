/* eslint-disable react/jsx-props-no-spreading */
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFieldComponent } from '@panneau/core/contexts';
import Button from '@panneau/element-button';
import Form from '@panneau/element-form';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

const propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};

const defaultProps = {
    className: null,
};

const SearchFilter = ({ name, value, onChange, className }) => {
    const [searchValue, setSearchValue] = useState(value !== null ? value[name] || null : null);
    const TextField = useFieldComponent('text');
    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            let newValue = null;
            if (!isEmpty(searchValue)) {
                newValue = {
                    ...value,
                    [name]: searchValue,
                };
            } else if (value !== null) {
                newValue = omit(value, [name]);
            }
            if (onChange !== null) {
                onChange(newValue);
            }
        },
        [name, value, searchValue],
    );
    const onReset = useCallback(() => {
        const newValue = value !== null ? omit(value, [name]) : null;
        setSearchValue(null);
        if (onChange !== null) {
            onChange(newValue);
        }
    }, [name, value, setSearchValue]);
    return (
        <Form className={className} onSubmit={onSubmit} withoutActions>
            <div className="input-group">
                <TextField type="search" value={searchValue} onChange={setSearchValue} />
                {!isEmpty(searchValue) ? (
                    <Button
                        type="button"
                        onClick={onReset}
                        className="position-absolute top-0 end-0"
                        style={{
                            transform: 'translateX(-100%)',
                            zIndex: 10,
                        }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                ) : null}

                <Button theme="secondary" type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                </Button>
            </div>
        </Form>
    );
};

SearchFilter.propTypes = propTypes;
SearchFilter.defaultProps = defaultProps;

export default SearchFilter;
