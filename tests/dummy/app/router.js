import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import FormRehydration from 'ember-fastboot-form-rehydration';

const Router = EmberRouter.extend(FormRehydration, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
});

export default Router;
