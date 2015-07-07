'use strict';

import React from 'react';
import t from 'tcomb-form';
import map from 'lodash/collection/map';
import types from '../../lib/types';
import { translate } from '../../lib/i18n';
import Form from '../form';

export default React.createClass({
  displayName: 'Authentication',

  getInitialState() {
    return {
      activeForm: this.props.activeForm
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeForm != null) {
      this.setState({ activeForm: nextProps.activateForm });
    }
  },

  activateForm(activeForm, e) {
    e.preventDefault();

    this.setState({ activeForm });
  },

  renderButtons() {
    let buttons = map(this.props.providers, ({ name }) => {
      let handleClick = this.props.logIn.bind(null, name);

      return (
        <button key={name} onClick={handleClick}>{name}</button>
      );
    });

    buttons.push(
      <button key='email' onClick={this.activateForm.bind(this, 'logIn')}>Email</button>
    );

    return buttons;
  },

  renderLogInForm() {
    let type = t.struct({
      login: types.Login,
      password: types.Password
    });

    let errors = this.props.errors.logIn;
    let hasError = errors && errors.provider === 'classic';
    let fields = {
      login: {
        attrs: {
          placeholder: translate('Your email or username'),
          type: 'text'
        },
        hasError
      },
      password: {
        attrs: {
          placeholder: translate('Your password'),
          type: 'password'
        },
        hasError
      }
    };

    let m = 'Log in';
    let d = false;

    return (
      <Form type={type} fields={fields} submitMessage={m} onSubmit={this.props.logIn} disabled={d} />
    );
  },

  renderSignUpForm() {
    let type = t.struct({
      name: types.Name,
      email: types.Email,
      password: types.Password
    });

    let errors = (this.props.errors.signUp || {}).errors || {};
    let fields = {
      name: {
        attrs: {
          placeholder: translate('Your name'),
          type: 'text'
        },
        hasError: !!errors.name
      },
      email: {
        attrs: {
          placeholder: translate('Your email'),
          type: 'email'
        },
        hasError: !!errors.email
      },
      password: {
        attrs: {
          placeholder: translate('Your password'),
          type: 'password'
        },
        hasError: !!errors.password
      }
    };

    let m = 'Sign up';
    let d = false;

    return (
      <Form type={type} fields={fields} submitMessage={m} onSubmit={this.props.signUp} disabled={d} />
    );
  },

  renderResetPasswordForm() {
    let type = t.struct({ email: types.Email });

    let fields = {
      email: {
        attrs: {
          placeholder: translate('Your email'),
          type: 'email'
        },
        hasError: this.props.errors.resetPassword != null
      }
    };

    let m = 'Send reset instructions';
    let d = false;

    return (
      <Form type={type} fields={fields} submitMessage={m} onSubmit={this.props.resetPassword} disabled={d} />
    );
  },

  renderActiveForm() {
    let { activeForm } = this.state;

    if (activeForm == null) { return null; }

    if (activeForm === 'logIn') {
      return this.renderLogInForm();
    } else if (activeForm === 'signUp') {
      return this.renderSignUpForm();
    } else if (activeForm === 'resetPassword') {
      return this.renderResetPasswordForm();
    }
  },

  render() {
    return (
      <div>
        {this.renderButtons()}
        <hr />
        {this.renderActiveForm()}
        <hr />
        <a href='javascript: void 0;' onClick={this.activateForm.bind(this, 'logIn')}>log in</a>
        {' '}
        <a href='javascript: void 0;' onClick={this.activateForm.bind(this, 'signUp')}>sign up</a>
        {' '}
        <a href='javascript: void 0;' onClick={this.activateForm.bind(this, 'resetPassword')}>reset password</a>
      </div>
    );
  }
});
