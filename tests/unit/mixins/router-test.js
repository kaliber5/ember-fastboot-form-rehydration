import EmberObject from '@ember/object';
import RouterMixin from 'ember-fastboot-form-rehydration/mixins/router';
import { module, test } from 'qunit';
import { run } from '@ember/runloop';

module('Unit | Mixin | router');

test('inspect & rehydrate was called on the first didTransition', function(assert) {
  assert.expect(2);

  let RouterObject = EmberObject.extend(RouterMixin);
  let subject = RouterObject.create({
    formRehydration: {
      inspect() {
        assert.ok(true, `inspect was called`);
      },

      rehydrate() {
        assert.ok(true, `rehydrate was called`);
      }
    }
  });

  run(()=> {
    subject.didTransition();
  });

  run(()=> {
    subject.didTransition(); // Testing inspect & rehydrate was not called on subsequent transitions
  })
});
