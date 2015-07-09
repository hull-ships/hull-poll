'use strict';

import React from 'react';
import styles from '../../../styles/all.css';
import getClassName from '../../../lib/get-class-name';

const cx = getClassName.bind(null, styles, 'hull');

export default React.createClass({
  displayName: 'Textbox',

  handleChange(e) {
    this.props.onChange(e.target.value);
  },

  render() {
    let node = this.props.type === 'textarea' ? React.DOM.textarea : React.DOM.input;

    return node({
      ...this.props.attrs,
      className: cx('formInput formInput--textbox'),
      onChange: this.handleChange
    });
  }
});
