import { schedule } from '@ember/runloop';

export function initialize(appInstance) {
  if (typeof FastBoot !== 'undefined') {
    return;
  }

  let service = appInstance.lookup('service:form-rehydration');

  // gather all input values just before the ember-cli-fastboot instance initializer will clear the DOM
  service.inspect();

  // reapply the values after Ember has rerendered
  schedule('afterRender', service, 'rehydrate');
}

export default {
  before: 'clear-double-boot', // run before DOM is erased by https://github.com/ember-fastboot/ember-cli-fastboot/blob/master/app/instance-initializers/clear-double-boot.js
  initialize
};
