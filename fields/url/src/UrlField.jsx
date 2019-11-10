/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { FormGroup } from '@panneau/field';
import { PropTypes as PanneauPropTypes } from '@panneau/core';
import TextField from '@panneau/field-text';

import Url from './Url';

const propTypes = {
    name: PropTypes.string,
    label: PanneauPropTypes.label,
    value: PropTypes.string,
    schemes: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
};

const defaultProps = {
    name: null,
    label: null,
    value: null,
    schemes: ['http://', 'https://', 'ftp://'],
    onChange: null,
};

const UrlField = ({ label, name, value, schemes, onChange, ...other }) => {
    const url = useMemo(
        () =>
            new Url({
                schemes,
            }),
        [schemes],
    );
    const scheme = useMemo(() => url.getScheme(value), [url, value]);
    const valueWithoutScheme = useMemo(() => url.removeScheme(value), [url, value]);

    const onFieldChange = useCallback(
        newValue => {
            const valueWithScheme = !isEmpty(newValue) ? url.withScheme(newValue, scheme) : '';
            if (onChange !== null) {
                onChange(valueWithScheme);
            }
        },
        [onChange, url, scheme],
    );

    return (
        <FormGroup className="form-group-url" name={name} label={label} {...other}>
            <TextField
                inputOnly
                prefix={scheme}
                value={valueWithoutScheme}
                onChange={onFieldChange}
            />
        </FormGroup>
    );
};

UrlField.propTypes = propTypes;
UrlField.defaultProps = defaultProps;

export default UrlField;
