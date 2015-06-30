'use strict';

import React from 'react';
import map from 'lodash/collection/map';

export default React.createClass({
  displayName: 'VoteSection',

  renderQuestion(question) {
    let answerRef = this.props.answers[question.ref];
    let answers = map(question.answers, (a) => {
      let isSelected = answerRef === a.ref;
      let handleClick = isSelected ? null : this.props.selectAnswer.bind(null, question.ref, a.ref);

      return (
        <a key={a.ref} href='javascript: void 0;' onClick={handleClick}>
          <div>{a.name} {isSelected ? 'SELECTED' : 'NOT SELECTED'}</div>
        </a>
      );
    });

    return (
      <div key={question.ref}>
        <h1>{question.name}</h1>
        <p>{question.description}</p>
        <div>{answers}</div>
      </div>
    );
  },

  render() {
    let questions = this.props.quiz.questions.map(this.renderQuestion);

    return (
      <div>{questions}</div>
    );
  }
});
