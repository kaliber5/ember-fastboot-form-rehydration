import { module, test, skip } from 'qunit';
import { visit, find } from 'ember-native-dom-helpers';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

module('Acceptance | form rehydration');

const rootSelector = '#ember-testing';

const staticFormMarkup = `
<div id="ember123" class="ember-view">
  <form>
    <input name="title">
    <textarea name="text"></textarea>
  </form>
</div>
`;

test('it rehydrates form values', async function(assert) {
  document.querySelector(rootSelector).innerHTML = staticFormMarkup;
  document.querySelector(`${rootSelector} input[name="title"]`).value = 'foo';
  document.querySelector(`${rootSelector} textarea[name="text"]`).value = 'bar';

  this.application = startApp();

  await visit('/');

  assert.equal(find('input[name="title"]').value, 'foo');
  assert.equal(find('textarea[name="text"]').value, 'bar');

  await destroyApp(this.application);
});


test('it restores focus', async function(assert) {
  document.querySelector(rootSelector).innerHTML = staticFormMarkup;
  document.querySelector(`${rootSelector} input[name="title"]`).focus();

  this.application = startApp();

  await visit('/');

  assert.equal(find('input[name="title"]'), document.activeElement);

  await destroyApp(this.application);
});

test('it restores selection for the active element', async function(assert) {
  document.querySelector(rootSelector).innerHTML = staticFormMarkup;
  let input = document.querySelector(`${rootSelector} input[name="title"]`);
  input.value = 'foo';
  input.focus();

  input.setSelectionRange(0, 1); // Selecting "f" from "foo"

  this.application = startApp();

  await visit('/');

  let resultInput = find('input[name="title"]');
  assert.equal(resultInput.selectionStart, 0, 'selectionStart is correct');
  assert.equal(resultInput.selectionEnd, 1, 'selectionEnd is correct');

  await destroyApp(this.application);
});

// https://html.spec.whatwg.org/multipage/input.html#concept-input-apply
test(`it doesn't throw for an input with no selection support`, async function(assert) {
  assert.expect(0);

  document.querySelector(rootSelector).innerHTML = `<input name="title" type="number">`;
  document.querySelector(`${rootSelector} input[name="title"]`).focus();

  this.application = startApp();

  await visit('/');
  await destroyApp(this.application);
});


// All input selections could be restored in theory, but it adds very little value in practice...
skip(`it restores selection for all input elements`, async function(assert) {
  document.querySelector(rootSelector).innerHTML = staticFormMarkup;
  let input = document.querySelector(`${rootSelector} input[name="title"]`);
  let textarea = document.querySelector(`${rootSelector} textarea[name="text"]`);

  input.value = 'foo';
  input.setSelectionRange(0, 1); // Selecting "f" from "foo"

  textarea.value = 'bar';
  textarea.setSelectionRange(1, 2); // Selecting "a" from "bar"

  this.application = startApp();

  await visit('/');

  let resultInput = find('input[name="title"]');
  assert.equal(resultInput.selectionStart, 0, 'selectionStart is correct for the input element');
  assert.equal(resultInput.selectionEnd, 1, 'selectionEnd is correct for the input element');

  let resultTextarea = find('textarea[name="text"]');
  assert.equal(resultTextarea.selectionStart, 1, 'selectionStart is correct for the textare');
  assert.equal(resultTextarea.selectionEnd, 2, 'selectionEnd is correct for the textare');

  await destroyApp(this.application);
});
