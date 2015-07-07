'use strict';

import React from 'react';

export default React.createClass({
  displayName: 'Textbox',

  handleChange(e) {
    this.props.onChange(e.target.value);
  },

  render() {
    let node = this.props.type === 'textarea' ? React.DOM.textarea : React.DOM.input;

    return node({
      ...this.props.attrs,
      onChange: this.handleChange
    });
  }
});
