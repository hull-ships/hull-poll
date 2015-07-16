'use strict';

import React from 'react';
import map from 'lodash/collection/map';
import each from 'lodash/collection/each';
import color from 'color';
import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations';
import { translate } from '../../lib/i18n';
import styles from '../../styles/all.css';
import getClassName from '../../lib/get-class-name';
import Authentication from '../authentication';

const cx = getClassName.bind(null, styles, 'hull');

function parseSelector(selector) {
  return selector.replace(/\.([a-z-_]*)/g, (_, capture) => {
    return `.${styles[capture] || capture}`;
  });
}

function renderStyles() {
  let textColor = color('#fff');
  let mainColor = color('blue');

  let backgroundColor = color('#000');
  let backgroundImageUrl = 'http://www.fubiz.net/wp-content/uploads/2015/07/hammada-1-900x879.jpg';

  let buttonTextColor = color('#0f0');

  let rules = {
    '.poll': {
      background: backgroundColor.rgbString(),
      color: textColor.alpha(0.6).rgbString()
    },
    '.poll a': {
      color: textColor.alpha(0.6).rgbString()
    },
    '.poll a:hover, .poll a:focus': {
      color: textColor.alpha(0.8).rgbString()
    },
    '.poll__content': {
      backgroundImage: `linear-gradient(to bottom, ${backgroundColor.alpha(0).rgbString()} 60%, ${backgroundColor.rgbString()} 100%)`
    },
    '.poll__content::after': {
      backgroundImage: `url(${backgroundImageUrl})`
    },
    '.btn--primary': {
      backgroundColor: mainColor.rgbString(),
      color: buttonTextColor.rgbString()
    },
    '.question__name, .nav__item--active, a.nav__item--active, .nav__item--active:hover, a.nav__item--active:hover': {
      color: textColor.alpha(1).rgbString()
    },
    '.answer': {
      backgroundColor: textColor.alpha(0.05).rgbString(),
      boxShadow: `inset 0 0 0 1px ${textColor.alpha(0.2).rgbString()}`
    },
    '.answer--hoverable:hover': {
      backgroundColor: textColor.alpha(0.2).rgbString()
    },
    '.answer__name': {
      color: textColor.alpha(1).rgbString()
    },
    '.answer__bar': {
      backgroundColor: textColor.alpha(0.2).rgbString()
    },
    '.answer--selected .answer__bar': {
      backgroundColor: mainColor.alpha(1).rgbString()
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

export default React.createClass({
  displayName: 'Poll',

  renderQuestion(question) {
    let isVoteSection = this.props.activeSection === 'vote';
    let isResultsSection = this.props.activeSection === 'results';

    let answerRef = this.props.answers[question.ref];
    let { total, answersStats } = this.props.questionsStats[question.ref];

    let description;
    let content;
    if (this.props.activeSection === 'logIn') {
      description = <p className={cx('question__description')}>{translate('Please log in or sign up to participate')}</p>;
      content = <Authentication {...this.props} />;
    } else {
      let answers = map(question.answers, (a) => {
        let percentage = 0;
        let meta;
        if (isResultsSection) {
          percentage = Math.round((answersStats[a.ref] / total) * 100);

          let m = translate('{percentage}% ({votes, plural, =0 {No vote} =1 {One vote} other {# votes}})', {
            percentage,
            votes: answersStats[a.ref]
          });
          meta = <p className={cx('answer__meta')}>{m}</p>;
        }

        let classes = cx({
          'answer': true,
          'answer--hoverable': isVoteSection,
          'answer--selected': answerRef === a.ref
        });

        let handleClick = isVoteSection && this.props.selectAnswer.bind(null, question.ref, a.ref);
        return (
          <div className={classes} onClick={handleClick} key={a.ref}>
            <div className={cx('answer__content')}>
              {meta}
              <h2 className={cx('answer__name')}>{a.name}</h2>
            </div>
            <div className={cx('answer__bar')} style={{ width: `${percentage}%` }}></div>
          </div>
        );
      });

      description = question.description && <p className={cx('question__description')}>{question.description}</p>;
      content = <div className={cx('question__answers')}>{answers}</div>;
    }

    return (
      <div key={question.ref}>
        <h1 className={cx('question__name')}>{question.name}</h1>
        {description}
        <div className={cx('question__content')}>{content}</div>
      </div>
    );
  },

  render() {
    return (
      <div className={cx('poll')}>
        {renderStyles()}
        <div className={cx('poll__content')}>{this.props.quiz.questions.map(this.renderQuestion)}</div>
      </div>
    );
  }
});
