import { schedule } from '@ember/runloop';

export function initialize(appInstance) {
  if (typeof FastBoot !== 'undefined') {
    return;
  }

  let service = appInstance.lookup('service:form-rehydration');
  let originalDidCreateRootView = appInstance.didCreateRootView;

  appInstance.didCreateRootView = function() {
    // gather all input values just before the ember-cli-fastboot instance initializer will clear the DOM
    service.inspect();

    originalDidCreateRootView.apply(appInstance, arguments);

    // reapply the values after Ember has rerendered
    schedule('afterRender', service, 'rehydrate');
  };
}

export default {
  // run after FastBoot initializer https://github.com/ember-fastboot/ember-cli-fastboot/blob/master/app/instance-initializers/clear-double-boot.js
  // so it can "wins" patching didCreateRootView
  after: 'clear-double-boot',
  initialize
};
