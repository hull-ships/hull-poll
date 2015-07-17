'use strict';

import assign from 'object-assign';
import reduce from 'lodash/collection/reduce';
import all from 'lodash/collection/all';
import each from 'lodash/collection/each';
import { EventEmitter } from 'events';

const EVENT = 'CHANGE';

const METHODS = {
  login: 'logIn',
  signup: 'signUp'
};

const ACTIONS = [
  'selectAnswer',
  'submitAnswers',
  'signUp',
  'logIn',
  'resetPassword'
];

function Engine(deployment) {
  this._ship = deployment.ship;
  this._platform = deployment.platform;
  this._settings = deployment.settings;
  this._organization = deployment.organization;
  this.resetState();

  Hull.on('hull.user.**', (user) => {
    // Ignore the events that come from actions.
    let nextUser = user || {};
    let previousUser = this._user || {};

    if (nextUser.id !== previousUser.id) { this.fetchShip(); }
  });
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
      ship: this._ship,
      quiz: this._quiz,
      answers: this._answers,
      questionsStats: this.getQuestionsStats(),
      errors: this._errors,
      providers: this.getProviders()
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
    this._quiz = this._ship.resources.quiz;

    if (this._quiz == null) {
      throw new Error('Quiz resource is missing.');
    }

    this._errors = {};

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
    this._quizIsSubmited = this.userHasVoted();
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

    if (this._quizIsSubmited) {
      return 'results';
    }

    return 'vote';
  },

  getProviders() {
    let providers = [];

    let services = Hull.config().services.auth;

    for (let k in services) {
      if (services.hasOwnProperty(k) && k !== 'hull') {
        let provider = { name: k };
        provider.isLinked = !!this._identities[k];
        provider.isUnlinkable = provider.isLinked && this._user.main_identity !== k;

        providers.push(provider);
      }
    }

    return providers;
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
    this._quizIsSubmited = true;

    this.emitChange();

    Hull.api(this._quiz.id + '/achieve', 'post', { answers: this._answers }, (r) => {
      this._quiz.badge = r;

      this.emitChange();
    });
  },

  signUp(credentials) {
    return this.perform('signup', credentials).then(() => {
      return this.fetchShip();
    });
  },

  logIn(providerOrCredentials) {
    return this.perform('login', providerOrCredentials).then(() => {
      return this.fetchShip();
    });
  },

  resetPassword(email) {
    let d = typeof email === 'string' ? { email } : email;
    let r = Hull.api('/users/request_password_reset', 'post', d);

    r.catch((error) => {
      this._errors.resetPassword = error;

      this.emitChange();
    });

    return r;
  },

  perform(method, provider) {
    let options;
    if (typeof provider === 'string') {
      options = { provider };
    } else {
      options = { ...provider };
      provider = 'classic';
    }

    this._errors = {};

    this.emitChange();

    let promise = Hull[method](options);

    promise.then(() => {
      this._errors = {};

      this.emitChange();
    }, (error) => {
      error.provider = provider;
      let m = METHODS[method] || method;
      this._errors[m] = error;

      this.emitChange();
    });

    return promise;
  },

  fetchShip() {
    let id = (this._fetchShipPromiseId || 0) + 1;
    this._fetchShipPromiseId = id;

    return Hull.api(this._ship.id).then((ship) => {
      if (id !== this._fetchShipPromiseId) { return; }

      this._ship = ship;
      this.resetState();

      this.emitChange();
    });
  }
});

export default Engine;
