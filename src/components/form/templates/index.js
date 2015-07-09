'use strict';

import React from 'react';
import Textbox from './textbox';
import map from 'lodash/collection/map';
import styles from '../../../styles/all.css';
import getClassName from '../../../lib/get-class-name';

const cx = getClassName.bind(null, styles, 'hull');

function render(Component, locals) {
  return (
    <Component {...locals} />
  );
}

export default {
  struct(locals) {
    let controls = map(locals.order, function(n) {
      return <div key={locals.inputs[n].key} className={cx('formControl')}>{locals.inputs[n]}</div>;
    });

    return <div>{controls}</div>;
  },

  textbox(locals) {
    return render(Textbox, locals);
  }
};
