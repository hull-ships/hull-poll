'use strict';

import React from 'react';
import t from './t';

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
      <form onSubmit={this.handleSubmit}>
        <TCombForm ref='form' type={this.props.type} options={this.getOptions()} value={this.state.value} onChange={this.handleChange} />
        <button type='submit' kind='primary' block={true} disabled={!!this.props.disabled}>{this.props.submitMessage}</button>
      </form>
    );
  }
});
