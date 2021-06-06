/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import TextField from './TextField';

const propTypes = {};

const defaultProps = {};

const TelephoneField = (props) => <TextField {...props} type="tel" />;

TelephoneField.propTypes = propTypes;
TelephoneField.defaultProps = defaultProps;

export default TelephoneField;