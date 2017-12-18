import Service from '@ember/service';
import { assign } from '@ember/polyfills';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';

function triggerBasicEvent(el, type) {
  let event = document.createEvent('Event');
  event.initEvent(type, true, true);
  el.dispatchEvent(event);
}

export default Service.extend({

  selectors: ['input', 'textarea'],

  inspect() {
    let rootElement = getOwner(this).rootElement || '';
    let elements = document.querySelectorAll(this.get('selectors').map((sel) => `${rootElement} ${sel}`).join(','));
    let props = Array.from(elements)
      .filter((el) => !!el.name)
      .map((el) => ({
        [el.name]: el.value
      }))
      .reduce((result, item) => assign(result, item), {})
    ;
    this.values = props;
    this.activeElement = document.activeElement && document.activeElement.name;
  },

  rehydrate() {
    assert('No values available. You must run `inspect` before `rehydrate`!', this.values);
    let rootElement = getOwner(this).rootElement || '';
    for (let name in this.values) {
      let el = document.querySelector(`${rootElement} [name="${name}"]`);
      if (el) {
        el.value = this.values[name];
        triggerBasicEvent(el, 'input');
        triggerBasicEvent(el, 'change');
      }
    }

    if (this.activeElement) {
      document.querySelector(`[name="${this.activeElement}"]`).focus();
    }
  }
});
