'use strict';

import React from 'react';
import map from 'lodash/collection/map';
import styles from '../../styles/all.css';
import getClassName from '../../lib/get-class-name';

const cx = getClassName.bind(null, styles, 'hull');

export default React.createClass({
  displayName: 'Poll',

  renderLogIn() {
    return <h1>Log In</h1>;
  },

  renderQuestion(question) {
    let isVoteSection = this.props.activeSection === 'vote';
    let isResultsSection = this.props.activeSection === 'results';

    let answerRef = this.props.answers[question.ref];
    let { total, answersStats } = this.props.questionsStats[question.ref];

    let answers = map(question.answers, (a) => {
      let p = 0;
      let meta;
      if (isResultsSection) {
        p = Math.round((answersStats[a.ref] / total) * 100);
        meta = <p className={cx('answer__meta')}>{p}% ({answersStats[a.ref]} votes)</p>;
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
          <div className={cx('answer__bar')} style={{ width: `${p}%` }}></div>
        </div>
      );
    });

    let description = question.description && <p className={cx('question__description')}>{question.description}</p>;
    return (
      <div key={question.ref}>
        <h1 className={cx('question__name')}>{question.name}</h1>
        {description}
        <div className={cx('question__answers')}>{answers}</div>
      </div>
    );
  },

  renderQuestions() {
    return (
      <div>{this.props.quiz.questions.map(this.renderQuestion)}</div>
    );
  },

  render() {
    let content = this.props.activeSection === 'logIn' ? this.renderLogIn() : this.renderQuestions();

    return (
      <div className={cx('poll')}>
        <div className={cx('poll__content')}>{content}</div>
      </div>
    );
  }
});
