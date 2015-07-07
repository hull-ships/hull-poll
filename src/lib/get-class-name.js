'use strict';

import isString from 'lodash/lang/isString';
import isArray from 'lodash/lang/isArray';
import isPlainObject from 'lodash/lang/isPlainObject';

function getClassName(styles, prefix, classNames) {
  if (classNames == null) { return ''; }

  classNames = isString(classNames) ? classNames.split(' ') : classNames;

  let classes = '';
  function addClass(name) {
    let prefixed = prefix == null ? name : `${prefix}-${name}`;
    classes += ' ' + prefixed;

    let compiled = styles[name];
    if (compiled != null) {
      classes += ' ' + compiled;
    }
  }

  if (isArray(classNames)) {
    for (let i = 0, l = classNames.length; i < l; i++) {
      addClass(classNames[i]);
    }
  } else if (isPlainObject(classNames)) {
    for (let name in classNames) {
      if (classNames.hasOwnProperty(name) && classNames[name]) {
        addClass(name);
      }
    }
  } else {
    throw new Error('classNames must be a string, an array or a plain object');
  }

  return classes;
}

export default getClassName;
