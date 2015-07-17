'use strict';

import React from 'react';
import map from 'lodash/collection/map';
import { translate } from '../../lib/i18n';
import renderCustomStyles from '../../styles/render-custom-styles';
import styles from '../../styles/all.css';
import getClassName from '../../lib/get-class-name';
import Authentication from '../authentication';

const cx = getClassName.bind(null, styles, 'hull');

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
      <span>
        {renderCustomStyles(this.props.ship)}

        <div className={cx('poll')}>
          <div className={cx('poll__content')}>{this.props.quiz.questions.map(this.renderQuestion)}</div>
        </div>
      </span>
    );
  }
});
