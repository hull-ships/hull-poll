'use strict';

import React from 'react';
import Textbox from './textbox';
import map from 'lodash/collection/map';

function render(Component, locals) {
  return (
    <Component {...locals} />
  );
}

export default {
  struct(locals) {
    let inputs = map(locals.order, function(n) {
      return <div key={locals.inputs[n].key}>{locals.inputs[n]}</div>;
    });

    return <div>{inputs}</div>;
  },

  textbox(locals) {
    return render(Textbox, locals);
  }
};
