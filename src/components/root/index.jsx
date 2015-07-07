import React from 'react';
import Poll from '../poll';

export default React.createClass({
  displayName: 'Root',

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

  render() {
    return <Poll {...this.state} {...this.props.actions} />;
  }
});
