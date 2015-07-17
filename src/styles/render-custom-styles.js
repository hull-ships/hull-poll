'use strict';

import React from 'react';
import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations';
import each from 'lodash/collection/each';
import color from 'color';
import styles from './all.css';

function parseSelector(selector) {
  return selector.replace(/\.([a-z-_]*)/g, (_, capture) => {
    return `.${styles[capture] || capture}`;
  });
}

function renderCustomStyles(ship) {
  let { settings } = ship;

  let mainColor = color(settings.main_color);
  let accentColor = color(settings.accent_color);
  let backgroundColor = color(settings.background_color);
  let buttonTextColor = color(settings.button_text_color);

  let rules = {
    '.poll': {
      background: backgroundColor.rgbString(),
      color: mainColor.alpha(0.6).rgbString()
    },
    '.poll a': {
      color: mainColor.alpha(0.6).rgbString()
    },
    '.poll a:hover, .poll a:focus': {
      color: mainColor.alpha(0.8).rgbString()
    },
    '.poll__content': {
      backgroundImage: `linear-gradient(to bottom, ${backgroundColor.alpha(0).rgbString()} 60%, ${backgroundColor.rgbString()} 100%)`
    },
    '.poll__content::after': {
      backgroundImage: `url(${settings.background_image})`,
      opacity: settings.background_image_opacity
    },
    '.btn--primary': {
      backgroundColor: accentColor.rgbString(),
      color: buttonTextColor.rgbString()
    },
    '.question__name, .nav__item--active, a.nav__item--active, .nav__item--active:hover, a.nav__item--active:hover': {
      color: mainColor.alpha(1).rgbString()
    },
    '.answer': {
      backgroundColor: mainColor.alpha(0.05).rgbString(),
      boxShadow: `inset 0 0 0 1px ${mainColor.alpha(0.2).rgbString()}`
    },
    '.answer--hoverable:hover, .answer--selected': {
      backgroundColor: mainColor.alpha(0.2).rgbString()
    },
    '.answer__name': {
      color: mainColor.alpha(1).rgbString()
    },
    '.answer__bar': {
      backgroundColor: mainColor.alpha(0.2).rgbString()
    },
    '.answer--selected .answer__bar': {
      backgroundColor: accentColor.alpha(1).rgbString()
    }
  };

  let m = '';
  each(rules, (s, selector) => {
    m += `${parseSelector(selector)} {`;
    m += createMarkupForStyles(s);
    m += '}';
    m += '\n\n';
  });

  return <style>{m}</style>;
}

export default renderCustomStyles;
