import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return new RSVP.Promise((resolve)=> {
      setTimeout(()=> {
        resolve();
      }, 50);
    });
  }
});
