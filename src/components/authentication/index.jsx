'use strict';

import React from 'react';
import t from 'tcomb-form';
import map from 'lodash/collection/map';
import types from '../../lib/types';
import { translate } from '../../lib/i18n';
import Form from '../form';
import ICONS from '../icons';
import styles from '../../styles/all.css';
import getClassName from '../../lib/get-class-name';

const cx = getClassName.bind(null, styles, 'hull');

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

  toggleForm(e) {
    e.preventDefault();

    this.setState({
      activeForm: this.state.activeForm == null ? 'logIn' : null
    });
  },

  activateForm(activeForm, e) {
    e.preventDefault();

    this.setState({ activeForm });
  },

  renderButtons() {
    let buttons = map(this.props.providers, ({ name }) => {
      let handleClick = this.props.logIn.bind(null, name);

      let Icon = ICONS[name];
      let c = Icon ? <Icon size={14} /> : name;
      return (
        <button key={name} className={cx(`btn btn--${name} btn--silent`)} onClick={handleClick}>{c}</button>
      );
    });

    buttons.push(
      <button key='email' className={cx(`btn btn--primary btn--email btn--silent`)} onClick={this.toggleForm}>
        <ICONS.email size={14} />
      </button>
    );

    return <div className={cx('authentication__buttons btnGroup')}>{buttons}</div>;
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

    let m = translate('Log in');
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

    let m = translate('Sign up');
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

    let m = translate('Send reset instructions');
    let d = false;

    return (
      <Form type={type} fields={fields} submitMessage={m} onSubmit={this.props.resetPassword} disabled={d} />
    );
  },

  renderNavLink(activeForm, wording) {
    let classes = cx({
      'nav__item': true,
      'nav__item--active': this.state.activeForm === activeForm
    });

    return <a href='javascript: void 0;' className={classes} onClick={this.activateForm.bind(this, activeForm)}>{wording}</a>;
  },

  renderForm() {
    let { activeForm } = this.state;

    if (activeForm == null) { return null; }

    let form;
    if (activeForm === 'logIn') {
      form = this.renderLogInForm();
    } else if (activeForm === 'signUp') {
      form = this.renderSignUpForm();
    } else if (activeForm === 'resetPassword') {
      form = this.renderResetPasswordForm();
    }

    let footer = activeForm === 'logIn' && <p className={cx('authentication__footer')}><a href='javascript: void 0;' onClick={this.activateForm.bind(this, 'resetPassword')}>Forgot password?</a></p>;
    return (
      <div className={cx('authentication__form')}>
        <div className={cx('nav')}>
          {this.renderNavLink('logIn', translate('Log in'))}
          {this.renderNavLink('signUp', translate('Sign up'))}
        </div>
        {form}
        {footer}
      </div>
    );
  },

  render() {
    return (
      <div className={cx('authentication')}>
        {this.renderButtons()}
        {this.renderForm()}
      </div>
    );
  }
});
