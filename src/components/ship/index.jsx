'use strict';

import React from 'react';
import Sections from './sections';

export default React.createClass({
  displayName: 'Ship',

  getInitialState() {
    return this.props.engine.getState();
  },

  componentWillMount() {
    this.props.engine.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    this.props.engine.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.setState(this.props.engine.getState());
  },

  renderActiveSection() {
    let Section = Sections[this.state.activeSection];

    return <Section {...this.state} {...this.props.actions} />;
  },

  render() {
    // return this.renderActiveSection();

    return (
      <div>
        <Sections.vote {...this.state} {...this.props.actions} />
        <hr />
        <Sections.results {...this.state} {...this.props.actions} />
      </div>
    );
  }
});
