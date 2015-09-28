import React from 'react';
import Engine from './lib/engine';
import { setTranslations } from './lib/i18n';
import Root from './components/root';

function boostrap(element, deployment) {
  let engine = new Engine(deployment);

  setTranslations(deployment.ship.translations);

  if (deployment.onUpdate && typeof deployment.onUpdate === 'function') {
    deployment.onUpdate(function(ship) {
      setTranslations(ship.translations);
      engine.updateShip(ship);
    });
  }

  React.render(<Root engine={engine} actions={engine.getActions()} />, element);
}

export default boostrap;
