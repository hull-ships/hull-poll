'use strict';

import React from 'react';
import t from './t';
import styles from '../../styles/all.css';
import getClassName from '../../lib/get-class-name';

const cx = getClassName.bind(null, styles, 'hull');
const TCombForm = t.form.Form;

export default React.createClass({
  displayName: 'Form',

  getInitialState() {
    return {
      value: this.props.value || {}
    };
  },

  getOptions() {
    return {
      fields: this.props.fields
    };
  },

  handleChange(value) {
    this.setState({ value });
  },

  handleSubmit(e) {
    e.preventDefault();

    const value = this.refs.form.getValue();
    if (value) { this.props.onSubmit(value); }
  },

  render() {
    return (
      <form className={cx('form')} onSubmit={this.handleSubmit}>
        <div className={cx('form__content')}>
          <TCombForm ref='form' type={this.props.type} options={this.getOptions()} value={this.state.value} onChange={this.handleChange} />
        </div>
        <div className={cx('form__footer')}>
          <button className={cx('btn btn--block')} type='submit' disabled={!!this.props.disabled}>{this.props.submitMessage}</button>
        </div>
      </form>
    );
  }
});
