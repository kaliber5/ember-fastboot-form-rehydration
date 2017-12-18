import { module, test } from 'qunit';
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