import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';
import { get, set } from '@ember/object';

export default Mixin.create({
  formRehydration: service(),

  didTransition() {
    this._super(...arguments);

    if (typeof FastBoot !== 'undefined') {
      return;
    }

    let service = get(this, 'formRehydration');

    if (!get(service, 'didRehydrate')) {
      service.inspect();
      schedule('afterRender', service, 'rehydrate');
      set(service, 'didRehydrate', true);
    }
  }
});
