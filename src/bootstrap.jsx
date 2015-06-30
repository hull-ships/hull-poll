import React from 'react';
import Engine from './lib/engine';
import { setTranslations } from './lib/i18n';
import Ship from './components/ship';

function boostrap(element, deployment) {
  let engine = new Engine(deployment);

  setTranslations(deployment.ship.translations);

  React.render(<Ship engine={engine} actions={engine.getActions()} />, element);
}

export default boostrap;
