/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { FormattedMessage, defineMessages } from 'react-intl';
import { FieldsGroup } from '@panneau/field';
import { PropTypes as FormPropTypes } from '@panneau/form';

import styles from './styles.scss';

const messages = defineMessages({
    save: {
        id: 'forms.normal.buttons.submit',
        description: 'The label of the "save" form button',
        defaultMessage: 'Save',
    },
});

const propTypes = {
    action: PropTypes.string,
    method: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.shape({}),
    errors: FormPropTypes.errors,
    generalError: PropTypes.string,
    generalErrorDefaultMessage: PropTypes.string,
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            type: PropTypes.string,
            label: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.shape({
                    id: PropTypes.string,
                    description: PropTypes.string,
                    defaultMessage: PropTypes.string,
                }),
            ]),
            className: PropTypes.string,
            onClick: PropTypes.func,
        }),
    ),
    submitForm: PropTypes.func,
    onValueChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onErrors: PropTypes.func,
    onComplete: PropTypes.func,
    readOnly: PropTypes.bool,
    notice: PropTypes.node,
};

const defaultProps = {
    action: '',
    method: 'POST',
    buttons: [
        {
            id: 'submit',
            type: 'submit',
            label: messages.save,
            className: classNames({
                'btn-primary': true,
            }),
        },
    ],
    fields: [],
    value: null,
    errors: null,
    generalError: null,
    generalErrorDefaultMessage: 'Sorry, an error occured.',
    submitForm: null,
    onValueChange: null,
    onSubmit: null,
    onErrors: null,
    onComplete: null,
    readOnly: false,
    notice: null,
};

const childContextTypes = {
    form: FormPropTypes.form,
};

class NormalForm extends Component {
    constructor(props) {
        super(props);

        this.onFieldsValueChange = this.onFieldsValueChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFormSubmitComplete = this.onFormSubmitComplete.bind(this);
        this.onFormSubmitError = this.onFormSubmitError.bind(this);

        this.state = {
            value: props.value,
            errors: props.errors,
            generalError: props.generalError,
        };
    }

    getChildContext() {
        const { value, errors } = this.state;
        return {
            form: {
                errors,
                value,
            },
        };
    }

    componentWillReceiveProps({ value: nextValue, errors: nextErrors }) {
        const { value, errors } = this.props;
        const valueChanged = nextValue !== value;
        if (valueChanged) {
            this.setState({
                value: nextValue,
            });
        }

        const errorsChanged = nextErrors !== errors;
        if (errorsChanged) {
            this.setState({
                errors: nextErrors,
            });
        }
    }

    onFieldsValueChange(value) {
        const { onValueChange } = this.props;
        if (onValueChange !== null) {
            onValueChange(value);
        } else {
            this.setState({
                value,
            });
        }
    }

    onFormSubmit(e) {
        const { onSubmit, submitForm } = this.props;
        const { value } = this.state;

        if (onSubmit !== null) {
            onSubmit(e, value);
        }

        if (submitForm !== null) {
            e.preventDefault();
            submitForm(value)
                .then(this.onFormSubmitComplete)
                .catch(this.onFormSubmitError);
        }
    }

    onFormSubmitComplete(data) {
        const { onComplete } = this.props;
        if (onComplete !== null) {
            onComplete(data);
        }
    }

    onFormSubmitError(error) {
        const { onErrors, generalErrorDefaultMessage } = this.props;

        if (onErrors !== null) {
            onErrors(error);
        } else if (error.name === 'ValidationError') {
            this.setState({
                errors: error.responseData,
            });
        } else {
            // @TODO
            this.setState({
                generalError: generalErrorDefaultMessage,
            });
        }
    }

    renderErrors() {
        const { generalError } = this.state;

        const errorsClassNames = classNames({
            alert: true,
            'alert-danger': true,
        });
        return (
            <div className={errorsClassNames}>
                {isArray(generalError) ? (
                    <ul>{generalError.map(error => <li key={`error-${error}`}>{error}</li>)}</ul>
                ) : (
                    generalError
                )}
            </div>
        );
    }

    renderFields() {
        const { fields, readOnly } = this.props;
        const { value, errors } = this.state;
        return (
            <FieldsGroup
                readOnly={readOnly}
                fields={fields}
                value={value}
                errors={errors}
                onChange={this.onFieldsValueChange}
            />
        );
    }

    renderButtons() {
        const { buttons } = this.props;
        return (
            <div className={styles.buttons}>
                <div className="btn-group">
                    {buttons.map(({
                        id, label, type, className, onClick,
                    }) => (
                        <button
                            key={`actions-button-${id}`}
                            type={type}
                            className={classNames({
                                btn: true,
                                [className]: (className || null) !== null,
                                [styles.button]: true,
                                [styles[type]]: true,
                            })}
                            onClick={onClick || null}
                        >
                            {isString(label) ? label : <FormattedMessage {...label} />}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    renderNotice() {
        const { notice } = this.props;
        return notice;
    }

    render() {
        const { action, method } = this.props;
        const { generalError } = this.state;

        return (
            <div className={styles.container}>
                <div className={styles.form}>
                    <form action={action} method={method} onSubmit={this.onFormSubmit}>
                        {generalError ? (
                            <div className={styles.errors}>{this.renderErrors()}</div>
                        ) : null}
                        <div className={styles.fields}>{this.renderFields()}</div>
                        <div
                            className={classNames({
                                'mt-4': true,
                                'pt-2': true,
                                'border-top': true,
                                [styles.actions]: true,
                            })}
                        >
                            <div className={styles.cols}>
                                <div
                                    className={classNames({
                                        [styles.col]: true,
                                        [styles.colNotice]: true,
                                    })}
                                >
                                    {this.renderNotice()}
                                </div>
                                <div
                                    className={classNames({
                                        'text-right': true,
                                        [styles.col]: true,
                                        [styles.colActions]: true,
                                    })}
                                >
                                    {this.renderButtons()}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

NormalForm.propTypes = propTypes;
NormalForm.defaultProps = defaultProps;
NormalForm.childContextTypes = childContextTypes;

export default NormalForm;
