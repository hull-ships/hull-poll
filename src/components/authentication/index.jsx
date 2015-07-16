'use strict';

import React from 'react';
import t from 'tcomb-form';
import map from 'lodash/collection/map';
import reduce from 'lodash/collection/reduce';
import types from '../../lib/types';
import { translate } from '../../lib/i18n';
import Form from '../form';
import styles from '../../styles/all.css';
import getClassName from '../../lib/get-class-name';

const cx = getClassName.bind(null, styles, 'hull');

// TODO add soundcloud and vkontakte
const ICONS = reduce({
  facebook: 'M30.233,0H1.766C0.791,0,0,0.791,0,1.766v28.468C0,31.209,0.791,32,1.766,32h15.326V19.607 h-4.17v-4.829h4.17v-3.562c0-4.133,2.524-6.384,6.212-6.384c1.767,0,3.284,0.132,3.727,0.19v4.319l-2.558,0.001 c-2.005,0-2.394,0.953-2.394,2.352v3.083h4.782l-0.622,4.829h-4.16V32h8.154C31.209,32,32,31.209,32,30.234V1.766 C32,0.791,31.209,0,30.233,0z',
  foursquare: 'M24.652,0c0,0-14.713,0-17.068,0C5.229,0,4.537,1.771,4.537,2.887c0,1.116,0,27.117,0,27.117 c0,1.256,0.675,1.723,1.055,1.877c0.379,0.152,1.427,0.283,2.054-0.441c0,0,8.058-9.35,8.196-9.488 c0.209-0.209,0.209-0.209,0.419-0.209c0.418,0,3.525,0,5.214,0c2.189,0,2.541-1.562,2.77-2.482 c0.191-0.77,2.328-11.712,3.043-15.183C27.832,1.428,27.158,0,24.652,0z M24.244,19.26c0.191-0.77,2.328-11.712,3.043-15.183 M23.645,4.619l-0.717,3.733c-0.086,0.404-0.594,0.829-1.064,0.829c-0.473,0-6.65,0-6.65,0c-0.748,0-1.283,0.51-1.283,1.257v0.814 c0,0.748,0.538,1.278,1.287,1.278c0,0,5.113,0,5.64,0c0.529,0,1.047,0.579,0.934,1.143c-0.115,0.565-0.65,3.363-0.715,3.672 s-0.42,0.838-1.047,0.838c-0.529,0-4.606,0-4.606,0c-0.838,0-1.092,0.109-1.652,0.807c-0.562,0.697-5.606,6.756-5.606,6.756 c-0.052,0.059-0.102,0.041-0.102-0.021V4.563c0-0.477,0.415-1.037,1.037-1.037c0,0,13.164,0,13.697,0 C23.301,3.526,23.771,4,23.645,4.619z',
  github: 'M15.999,0.395C7.164,0.395,0,7.559,0,16.395 c0,7.07,4.584,13.067,10.942,15.183c0.8,0.146,1.092-0.347,1.092-0.771c0-0.38-0.014-1.387-0.021-2.722 c-4.451,0.967-5.39-2.145-5.39-2.145C5.896,24.093,4.847,23.6,4.847,23.6c-1.453-0.992,0.11-0.973,0.11-0.973 c1.606,0.113,2.451,1.649,2.451,1.649c1.428,2.444,3.745,1.738,4.657,1.33c0.145-1.034,0.559-1.74,1.016-2.14 c-3.553-0.404-7.288-1.776-7.288-7.908c0-1.748,0.624-3.175,1.647-4.293c-0.165-0.405-0.713-2.032,0.157-4.235 c0,0,1.344-0.43,4.4,1.64c1.276-0.355,2.645-0.532,4.006-0.539c1.359,0.006,2.727,0.184,4.006,0.539 c3.055-2.07,4.396-1.64,4.396-1.64c0.873,2.203,0.323,3.83,0.159,4.235c1.024,1.118,1.645,2.545,1.645,4.293 c0,6.147-3.741,7.5-7.306,7.895c0.575,0.495,1.086,1.471,1.086,2.964c0,2.139-0.02,3.863-0.02,4.389c0,0.429,0.288,0.925,1.101,0.77 C27.42,29.456,32,23.464,32,16.395C32,7.559,24.836,0.395,15.999,0.395z',
  google: 'M31.906,16.281h-4.21v4.211h-2.152v-4.211h-4.211v-2.058h4.211v-4.21h2.152v4.21h4.21V16.281z M20.422,24.051C20.422,27.989,16.43,32,9.116,32c-6.167,0-9.022-2.92-9.022-6.023c0-1.509,0.763-3.644,3.275-5.111 c2.634-1.592,6.209-1.801,8.123-1.929c-0.597-0.755-1.277-1.55-1.277-2.848c0-0.712,0.214-1.132,0.426-1.634 c-0.469,0.041-0.935,0.083-1.361,0.083c-4.507,0-7.06-3.312-7.06-6.577c0-1.927,0.6-4.205,2.427-5.754C7.071,0.237,10.17,0,12.468,0 l8.867,0.002l-2.754,1.684h-2.521c0.978,0.796,2.915,2.334,2.915,5.521c0,3.099-1.786,4.568-3.572,5.949 c-0.553,0.544-1.191,1.132-1.191,2.055c0,0.921,0.638,1.423,1.105,1.802l1.533,1.17C18.722,19.733,20.422,21.159,20.422,24.051z M14.171,12.192c0.978-0.966,1.062-2.2,1.062-2.954c0-3.017-1.828-7.71-5.357-7.71c-1.107,0-2.297,0.439-2.979,1.278 c-0.723,0.88-0.935,2.115-0.935,3.206c0,2.806,1.659,7.458,5.317,7.458C12.342,13.471,13.488,12.863,14.171,12.192z M17.568,25.687 c0-2.141-1.403-3.269-4.638-5.532c-0.339-0.043-0.552-0.043-0.976-0.043c-0.384,0-2.681,0.084-4.467,0.672 c-0.936,0.334-3.657,1.34-3.657,4.314c0,2.977,2.936,5.113,7.486,5.113C15.398,30.211,17.568,28.28,17.568,25.687z',
  instagram: 'M28.309,13.537h-2.786c0.203,0.788,0.323,1.611,0.323,2.462 c0,5.439-4.408,9.847-9.846,9.847s-9.846-4.407-9.846-9.847c0-0.851,0.12-1.674,0.323-2.462H3.691v13.54 c0,0.679,0.552,1.229,1.232,1.229h22.153c0.681,0,1.231-0.551,1.231-1.229V13.537z M28.309,4.923c0-0.68-0.551-1.231-1.231-1.231 h-3.692c-0.68,0-1.23,0.552-1.23,1.231v3.692c0,0.68,0.551,1.23,1.23,1.23h3.692c0.681,0,1.231-0.551,1.231-1.23V4.923z M16,9.846 c-3.399,0-6.154,2.755-6.154,6.153c0,3.399,2.755,6.154,6.154,6.154s6.154-2.755,6.154-6.154C22.154,12.601,19.399,9.846,16,9.846 M28.309,32H3.691C1.653,32,0,30.347,0,28.307V3.691C0,1.653,1.653,0,3.691,0h24.617C30.348,0,32,1.653,32,3.691v24.615 C32,30.347,30.348,32,28.309,32',
  linkedin: 'M29.633,0H2.361C1.059,0,0,1.033,0,2.307v27.384C0,30.965,1.059,32,2.361,32h27.272 C30.938,32,32,30.965,32,29.691V2.307C32,1.033,30.938,0,29.633,0z M9.493,27.268H4.742V11.997h4.751V27.268z M7.119,9.91 c-1.524,0-2.753-1.233-2.753-2.752c0-1.519,1.229-2.752,2.753-2.752c1.518,0,2.75,1.233,2.75,2.752 C9.869,8.677,8.637,9.91,7.119,9.91z M27.27,27.268h-4.746v-7.427c0-1.771-0.031-4.049-2.467-4.049 c-2.469,0-2.846,1.931-2.846,3.923v7.553H12.47V11.997h4.549v2.087h0.064c0.633-1.2,2.182-2.466,4.49-2.466 c4.807,0,5.695,3.161,5.695,7.274V27.268z',
  tumblr: 'M23.656,25.56c-0.595,0.283-1.733,0.531-2.582,0.553c-2.562,0.069-3.058-1.799-3.079-3.154v-9.962h6.425V8.152h-6.401V0 c0,0-4.611,0-4.688,0s-0.211,0.068-0.23,0.24c-0.274,2.495-1.442,6.873-6.296,8.623v4.133h3.238v10.456 c0,3.579,2.642,8.665,9.612,8.546c2.352-0.041,4.963-1.025,5.541-1.874L23.656,25.56z',
  twitter: 'M32,6.076c-1.178,0.522-2.442,0.875-3.771,1.034c1.355-0.812,2.396-2.099,2.887-3.632c-1.269,0.752-2.674,1.299-4.169,1.593 c-1.198-1.276-2.904-2.073-4.792-2.073c-3.626,0-6.566,2.939-6.566,6.565c0,0.515,0.058,1.016,0.17,1.496 C10.303,10.785,5.466,8.171,2.228,4.199C1.663,5.168,1.339,6.296,1.339,7.5c0,2.277,1.159,4.287,2.92,5.464 c-1.076-0.034-2.088-0.33-2.974-0.821c0,0.027,0,0.055,0,0.083c0,3.181,2.263,5.834,5.267,6.437c-0.551,0.15-1.131,0.23-1.73,0.23 c-0.423,0-0.834-0.041-1.235-0.117c0.835,2.607,3.26,4.506,6.133,4.559c-2.247,1.762-5.078,2.811-8.154,2.811 c-0.53,0-1.052-0.031-1.566-0.092c2.905,1.863,6.356,2.95,10.064,2.95c12.076,0,18.679-10.004,18.679-18.68 c0-0.285-0.007-0.567-0.019-0.849C30.007,8.548,31.12,7.392,32,6.076z',
  email: 'M28.202,3.848H3.798C1.704,3.848,0,5.484,0,7.495v17.01c0,2.011,1.704,3.647,3.798,3.647h24.404 c2.095,0,3.798-1.637,3.798-3.647V7.495C32,5.484,30.297,3.848,28.202,3.848z M28.202,24.932H3.798 c-0.308,0-0.578-0.199-0.578-0.427V9.744l11.037,9.318c0.227,0.191,0.514,0.297,0.811,0.297h1.864c0.297,0,0.584-0.105,0.811-0.297 l11.037-9.318v14.761C28.779,24.732,28.51,24.932,28.202,24.932z M16,16.162L5.265,7.068h21.47L16,16.162z'
}, (m, path, key) => {
  m[key] = React.createClass({
    displayName: key,

    getDefaultProps() {
      return {
        size: 32,
        fill: 'currentColor'
      };
    },

    render() {
      let { size, fill } = this.props;

      return (
        <span className={cx('icon')}>
          <svg xmlns="http://www.w3.org/svg/2000" viewBox='0 0 32 32' width={size} height={size} fill={fill}>
            <path d={path} />
          </svg>
        </span>
      );
    }
  });

  return m;
}, {});

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
          {this.renderNavLink('logIn', 'Log in')}
          {this.renderNavLink('signUp', 'Sign up')}
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
