/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import ReactMarkdown from 'react-markdown';
import { FormattedMessage } from 'react-intl';
import { PropTypes as PanneauPropTypes } from '@panneau/core';

const propTypes = {
    children: PropTypes.node,

    className: PropTypes.string,
    name: PropTypes.string,
    labelPrefix: PanneauPropTypes.label,
    label: PanneauPropTypes.label,
    labelSuffix: PanneauPropTypes.label,
    errors: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
    helpText: PropTypes.string,

    large: PropTypes.bool,
    small: PropTypes.bool,
    inline: PropTypes.bool,
    asPanel: PropTypes.bool,

    collapsible: PropTypes.bool,
    collapsed: PropTypes.bool,
    inputOnly: PropTypes.bool,
};

const defaultProps = {
    children: null,

    className: 'text',
    name: null,
    labelPrefix: null,
    label: null,
    labelSuffix: null,
    errors: [],
    helpText: null,

    large: false,
    small: false,
    inline: false,
    asPanel: false,

    collapsible: false,
    collapsed: false,
    inputOnly: false,
};

class FormGroup extends Component {
    constructor(props) {
        super(props);
        this.onCollapseChange = this.onCollapseChange.bind(this);
        this.renderError = this.renderError.bind(this);

        this.state = {
            collapsed: this.props.collapsed,
        };
    }

    onCollapseChange(e) {
        e.preventDefault();
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    renderErrors() {
        const { errors } = this.props;
        if (!errors || errors.length < 1) {
            return null;
        }
        const items = isArray(errors) ? errors : [errors];
        return items.map(this.renderError);
    }

    // eslint-disable-next-line class-methods-use-this
    renderError(error, key) {
        if (!error || !error.length) {
            return null;
        }
        const errorKey = `error_${key}`;
        return (
            <span key={errorKey} className="help-block">{error}</span>
        );
    }

    renderHelp() {
        const { helpText } = this.props;
        if (!helpText) {
            return null;
        }
        return (
            <div className="help-block">
                <ReactMarkdown
                    source={helpText}
                    linkTarget="_blank"
                />
            </div>
        );
    }

    renderLabel() {
        const {
            label,
            labelPrefix,
            labelSuffix,
            name,
            large,
            small,
            asPanel,
            collapsible,
        } = this.props;

        const caret = (
            <span className={this.state.collapsed ? 'dropright' : 'dropdown'}>
                <span className="caret up" />
            </span>
        );

        const labelNode = isObject(label) && typeof label.id !== 'undefined' ? (
            <FormattedMessage {...label} />
        ) : label;

        const link = collapsible ? (
            <button type="button" className="no-btn-style no-link" onClick={this.onCollapseChange}>
                {caret} {labelNode}
            </button>
        ) : labelNode;

        if (link === null && labelPrefix === null && labelSuffix == null) {
            return null;
        }

        const labelContainerClasses = classNames({
            'form-group-label': true,
            'panel-heading': asPanel,
        });

        const labelClasses = classNames({
            'control-label': !asPanel,
            'smaller-text': small,
        });

        return (
            <div className={labelContainerClasses}>
                { isObject(labelPrefix) && typeof labelPrefix.id !== 'undefined' ? (
                    <FormattedMessage {...labelPrefix} />
                ) : labelPrefix }
                { large ? (
                    <h4 className="control-label">{link}</h4>
                ) : (
                    <label htmlFor={name} className={labelClasses}>{link}</label>
                ) }
                { isObject(labelSuffix) && typeof labelSuffix.id !== 'undefined' ? (
                    <FormattedMessage {...labelSuffix} />
                ) : labelSuffix }
            </div>
        );
    }

    render() {
        const {
            inline,
            children,
            className,
            errors,
            inputOnly,
            asPanel,
            collapsible,
        } = this.props;

        if (inputOnly) {
            return children;
        }

        const customClassNames = className ? className.split(' ').reduce((obj, key) => ({
            ...obj,
            [key]: true,
        }), {}) : null;
        const formGroupClassNames = classNames({
            'form-group': true,
            'form-group-collapsible': collapsible,
            'has-error': errors && errors.length,
            'has-padding-bottom': inline,
            panel: asPanel && !inline,
            'panel-default': asPanel && !inline,
            ...customClassNames,
        });

        const formGroupInnerClassNames = classNames({
            'form-group-inner': true,
            'form-group-collapsible-inner': collapsible,
            'panel-body': asPanel && !inline,
        });

        const innerStyle = {
            display: this.state.collapsed ? 'none' : 'block',
        };

        if (inline) {
            return (
                <div className={formGroupClassNames}>
                    <div className="table-full table-form-height">
                        <div className="table-row">
                            <div className="table-cell-centered left">
                                { this.renderLabel() }
                            </div>
                            <div className="table-cell-centered right">
                                <div className={formGroupInnerClassNames} style={innerStyle}>
                                    { children }
                                </div>
                            </div>
                        </div>
                    </div>
                    { this.renderHelp() }
                    { this.renderErrors() }
                </div>
            );
        }
        return (
            <div className={formGroupClassNames}>
                { this.renderLabel() }
                { !this.state.collapsed ? (
                    <div className={formGroupInnerClassNames} style={innerStyle}>
                        { children }
                        { this.renderHelp() }
                        { this.renderErrors() }
                    </div>
                ) : null }
            </div>
        );
    }
}

FormGroup.propTypes = propTypes;
FormGroup.defaultProps = defaultProps;

export default FormGroup;
