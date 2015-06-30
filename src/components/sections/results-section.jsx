'use strict';

import React from 'react';
import map from 'lodash/collection/map';

export default React.createClass({
  displayName: 'ResultsSection',

  renderQuestion(question) {
    let { total, answersStats } = this.props.questionsStats[question.ref];

    let answers = map(question.answers, (a) => {
      let ratio = answersStats[a.ref] / total;
      let s = { width: `${ratio * 100}%`, background: 'red', height: 20 };
      return (
        <div key={a.ref}>
          <div style={s}></div>
          <div>{a.name} {answersStats[a.ref]} votes {ratio * 100}%</div>
        </div>
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
