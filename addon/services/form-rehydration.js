import Service from '@ember/service';
import { assign } from '@ember/polyfills';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';

function triggerBasicEvent(el, type) {
  let event = document.createEvent('Event');
  event.initEvent(type, true, true);
  el.dispatchEvent(event);
}

// https://html.spec.whatwg.org/multipage/input.html#concept-input-apply
function supportsSelection(input) {
  return /^(text|search|password|tel|url)$/.test(input.type);
}

export default Service.extend({

  selectors: ['input', 'textarea'],

  inspect() {
    let rootElement = getOwner(this).rootElement || '';
    let elements = document.querySelectorAll(this.get('selectors').map((sel) => `${rootElement} ${sel}`).join(','));
    let props = Array.from(elements)
      .filter((el) => !!el.name && el.value !== '')
      .map((el) => ({
        [el.name]: el.value
      }))
      .reduce((result, item) => assign(result, item), {})
    ;
    this.values = props;

    if (document.activeElement) {
      this.activeElementName = document.activeElement.name;

      if (supportsSelection(document.activeElement)) {
        this.selectionStart = document.activeElement.selectionStart;
        this.selectionEnd = document.activeElement.selectionEnd;
        this.selectionDirection = document.activeElement.selectionDirection;
      }
    }
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

    if (this.activeElementName) {
      let activeElement = document.querySelector(`[name="${this.activeElementName}"]`);
      activeElement.focus();

      if (supportsSelection(activeElement)) {
        activeElement.setSelectionRange(this.selectionStart, this.selectionEnd, this.selectionDirection);
      }
    }
  }
});
