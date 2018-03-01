import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import FormGroup from '@panneau/form-group';
import { ComponentsCollection, withFieldsCollection } from '@panneau/core';

const propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.object,
    ]),
    errors: PropTypes.oneOfType([
        PropTypes.object,
    ]),
    fields: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })),
    getFieldComponent: PropTypes.func,
    fieldsCollection: PropTypes.shape({
        getComponent: PropTypes.func,
    }),
    fieldsComponents: PropTypes.object, // eslint-disable-line
    renderNotFound: PropTypes.func,
    columns: PropTypes.number,
    collapsible: PropTypes.bool,
    collapsibleTypes: PropTypes.arrayOf(PropTypes.string),
    collapsed: PropTypes.bool,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
};

const defaultProps = {
    name: null,
    label: null,
    value: null,
    errors: null,
    fields: [],
    getFieldComponent: null,
    fieldsCollection: null,
    fieldsComponents: null,
    renderNotFound: null,
    columns: null,
    collapsible: false,
    collapsibleTypes: [],
    collapsed: false,
    onChange: null,
    readOnly: false,
};

class FieldsGroup extends Component {
    constructor(props) {
        super(props);

        this.renderField = this.renderField.bind(this);
    }

    onChange(key, value) {
        const hasKey = typeof key !== 'undefined' && key !== null;
        const currentValue = this.props.value || {};
        const newValue = {
            ...currentValue,
            ...(!hasKey ? value : null),
        };
        if (hasKey) {
            set(newValue, key, value);
        }
        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
    }

    getFieldComponent(key) {
        const { fieldsComponents, getFieldComponent, fieldsCollection } = this.props;
        const normalizedKey = ComponentsCollection.normalizeKey(key);

        if (getFieldComponent !== null) {
            return getFieldComponent(key);
        } else if (fieldsComponents !== null) {
            const fieldKey = Object.keys(fieldsComponents).find(k => (
                ComponentsCollection.normalizeKey(k) === normalizedKey
            ));
            return typeof fieldKey !== 'undefined' && fieldKey !== null ? fieldsComponents[fieldKey] : null;
        } else if (fieldsCollection !== null) {
            return fieldsCollection.getComponent(key);
        }

        return normalizedKey.toLowerCase() === 'fields' ? FieldsGroup : null;
    }

    renderNotFound(it, index) {
        const { renderNotFound } = this.props;
        const { type, name } = it;

        if (renderNotFound !== null) {
            return this.renderNotFound(it, index);
        }

        const key = `notfound-${name}${type}${index}${this.props.name}`;
        return (
            <div key={key}>NOT FOUND: Field { name } of type { type }</div>
        );
    }

    renderField(it, index) {
        const {
            value,
            errors,
            collapsibleTypes,
            readOnly,
        } = this.props;
        const {
            type,
            name,
            hidden,
            defaultValue,
            ...props
        } = it;
        const extraProps = it.props || {};

        if (hidden === true) {
            return null;
        }

        const FieldComponent = this.getFieldComponent(type);
        if (FieldComponent === null) {
            return this.renderNotFound(it, index);
        }

        const fieldDefaultValue = typeof defaultValue !== 'undefined' ? defaultValue : undefined;
        const fieldValue = value && name ? get(value, name, fieldDefaultValue) : value;
        let fieldErrors = errors && name ? Object.entries(errors).reduce((acc, [key, errs]) => {
            const escapedName = name.replace('.', '\\.');
            const regexp = RegExp(`^${escapedName}\\.|^${escapedName}$`);
            if (regexp.test(key)) {
                return [
                    ...acc,
                    ...errs,
                ];
            }
            return acc;
        }, []) : errors;
        if (Array.isArray(fieldErrors) && fieldErrors.length === 0) {
            fieldErrors = undefined;
        }
        const fieldCollapsible = collapsibleTypes.indexOf(type) !== -1 || it.collapsible;
        const fieldCollapsed = it.collapsed || (fieldCollapsible && typeof fieldValue === 'undefined');
        const key = `${name}${type}${index}${this.props.name}`;

        return (
            <FieldComponent
                {...props}
                collapsible={fieldCollapsible}
                collapsed={fieldCollapsed}
                {...extraProps}
                key={key}
                name={name}
                value={fieldValue}
                disabled={readOnly}
                errors={fieldErrors}
                onChange={(val) => {
                    this.onChange(name, val);
                }}
            />
        );
    }

    renderColumns(fields, columns) {
        const remainingFields = [].concat(fields);
        const fieldsWithoutColumns = fields.reduce((total, field) => (
            typeof field.column === 'undefined' ? (total + 1) : total
        ), 0);
        const fieldsByColumn = Math.ceil(fieldsWithoutColumns / columns);
        const cols = [];
        for (let colIndex = 0; colIndex < columns; colIndex += 1) {
            const col = [];
            const colFields = remainingFields.filter(field => (
                typeof field.column !== 'undefined' && field.column === colIndex
            ));
            if (colFields.length > 0) {
                colFields.forEach((colField) => {
                    const index = fields.findIndex(field => field === colField);
                    col.push(this.renderField(colField, index));
                    const remainingIndex = remainingFields.findIndex(field => field === colField);
                    if (remainingIndex !== -1) {
                        remainingFields.splice(1, remainingIndex);
                    }
                });
            } else {
                for (let i = 0; i < fieldsByColumn; i += 1) {
                    const remainingIndex = remainingFields.findIndex(field => (
                        typeof field.column === 'undefined'
                    ));
                    if (remainingIndex !== -1) {
                        const colField = remainingFields[remainingIndex];
                        const index = fields.findIndex(field => field === colField);
                        col.push(this.renderField(colField, index));
                        remainingFields.splice(1, remainingIndex);
                    }
                }
            }
            cols.push((
                <div className={`col-sm-${12 / columns}`} key={`col-${colIndex}`}>
                    { col }
                </div>
            ));
        }

        return (
            <div className="field-group">
                <div className="row">
                    { cols }
                </div>
            </div>
        );
    }

    renderFields(fields) {
        const { columns } = this.props;
        if (columns !== null) {
            return this.renderColumns(fields, columns);
        }
        return (
            <div className="field-group">
                { fields.map(this.renderField) }
            </div>
        );
    }

    render() {
        const {
            label,
            fields,
            collapsible,
            collapsed,
        } = this.props;

        const fieldsGroup = this.renderFields(fields);

        return label !== null ? (
            <FormGroup label={label} collapsible={collapsible} collapsed={collapsed}>
                { fieldsGroup }
            </FormGroup>
        ) : fieldsGroup;
    }
}

FieldsGroup.propTypes = propTypes;
FieldsGroup.defaultProps = defaultProps;

export default withFieldsCollection()(FieldsGroup);
