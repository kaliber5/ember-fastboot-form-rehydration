import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    change(e) {
      e.target.classList.add('event-change');
    },

    input(e) {
      e.target.classList.add('event-input');
    }
  }
});
