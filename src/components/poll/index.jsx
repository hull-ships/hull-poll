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

    let description = question.description && <p className={cx('question__description')}>{question.description}</p>;
    return (
      <div key={question.ref} className={cx('question')}>
        <h1 className={cx('question__name')}>{question.name}</h1>
        {description}
        <div className={cx('question__content')}>
          <div className={cx('question__answers')}>{answers}</div>
        </div>
      </div>
    );
  },

  renderContent() {
    if (this.props.activeSection === 'logIn') {
      return (
        <div className={cx('question')}>
          <p className={cx('question__name')}>{translate('Please log in or sign up!')}</p>
          <p className={cx('question__description')}>{translate('An account is required to participate')}</p>
          <div className={cx('question__content question__content--authentication')}>
            <Authentication {...this.props} />
          </div>
        </div>
      );
    }

    if (this.props.quiz.questions.length === 1) {
      return this.renderQuestion(this.props.quiz.questions[0]);
    }

    let button = this.props.activeSection === 'vote' && <button className={cx('btn btn--primary btn--block')} type='button' disabled={!this.props.userHasVoted} onClick={this.props.submitAnswers}>{translate('Submit answers')}</button>;
    return (
      <div className={cx('poll__questions')}>
        {map(this.props.quiz.questions, this.renderQuestion)}
        {button}
      </div>
    );
  },

  render() {
    return (
      <span>
        {renderCustomStyles(this.props.ship)}

        <div className={cx('poll')}>
          <div className={cx('poll__content')}>
            {this.renderContent()}
          </div>
        </div>
      </span>
    );
  }
});
