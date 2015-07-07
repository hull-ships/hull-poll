import assign from 'object-assign';
import reduce from 'lodash/collection/reduce';
import all from 'lodash/collection/all';
import each from 'lodash/collection/each';
import { EventEmitter } from 'events';

const EVENT = 'CHANGE';

const ACTIONS = [
  'selectAnswer',
  'submitAnswers'
];

function Engine(deployment) {
  this._ship = deployment.ship;
  this._platform = deployment.platform;
  this._settings = deployment.settings;
  this._organization = deployment.organization;
  this._quiz = this._ship.resources.quiz;

  this.resetState();
}

assign(Engine.prototype, EventEmitter.prototype, {
  getActions() {
    if (this._actions) { return this._actions; }

    this._actions = reduce(ACTIONS, (m, a) => {
      m[a] = this[a].bind(this);
      return m;
    }, {});

    return this._actions;
  },

  getState() {
    return {
      user: this._user,
      userHasVoted: this.userHasVoted(),
      activeSection: this.getActiveSection(),
      quiz: this._quiz,
      answers: this._answers,
      questionsStats: this.getQuestionsStats()
    };
  },

  addChangeListener(listener) {
    this.addListener(EVENT, listener);
  },

  removeChangeListener(listener) {
    this.removeListener(EVENT, listener);
  },

  emitChange() {
    this.emit(EVENT);
  },

  resetState() {
    this.resetUser();
    this.resetQuestionsStats();
    this.resetAnswers();
  },

  resetUser() {
    this._user = Hull.currentUser();

    let identities = {};
    if (this._user != null) {
      each(this._user.identities, (identity) => {
        identities[identity.provider] = true;
      });
    }

    this._identities = identities;
  },

  resetQuestionsStats() {
    this._questionsStats = reduce(this._quiz.questions, (m, q) => {
      m[q.ref] = reduce(q.answers, (n, a) => {
        n[a.ref] = a.stats.users || 0;

        return n;
      }, {});

      return m;
    }, {});
  },

  resetAnswers() {
    this._answers = (this._quiz.badge && this._quiz.badge.data.answers) || {};
  },

  userHasVoted() {
    return !!this._user && all(this._quiz.questions, (q) => {
      return this._answers[q.ref] != null;
    });
  },

  getQuestionsStats() {
    return reduce(this._quiz.questions, (m, q) => {
      let answersStats = this._questionsStats[q.ref];
      let total = reduce(answersStats, (n, a) => { return n + a; }, 0);

      m[q.ref] = { answersStats, total };

      return m;
    }, {});
  },

  getActiveSection() {
    if (this._user == null) {
      return 'logIn';
    }

    if (this.userHasVoted()) {
      return 'results';
    }

    return 'vote';
  },

  selectAnswer(questionRef, answerRef) {
    let previousAnswerRef = this._answers[questionRef];

    if (previousAnswerRef === answerRef) { return; }

    this._answers[questionRef] = answerRef;

    // Optimistic update of the answer distribution.
    if (previousAnswerRef != null) {
      this._questionsStats[questionRef][previousAnswerRef] -= 1;
    }
    this._questionsStats[questionRef][answerRef] += 1;

    this.emitChange();

    // Submit the answers automaticaly if there is only one question.
    if (this._quiz.questions.length === 1) {
      this.submitAnswers();
    }
  },

  submitAnswers() {
    Hull.api(this._quiz.id + '/achieve', 'post', { answers: this._answers }, (r) => {
      this._quiz.badge = r;

      this.emitChange();
    });
  }
});

export default Engine;
