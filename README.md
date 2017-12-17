# ember-fastboot-form-rehydration

This addon tries to mitigate a common problem of FastBoot rendered Ember apps
containing form controls.

## Installation

`ember install ember-fastboot-form-rehydration`

## The Problem

For users on a slow (mobile) connection there will be some considerable delay between
the time of the first paint, where the browser displays the static FastBoot-rendered content, 
and the time when all the app's JavaScript has been loaded, parsed and evaluated. At that time - 
at the current state of Ember and FastBoot, see "Outlook" below - the existing static DOM will
be destroyed, loosing all its state, and Ember will take over and render the whole application again.

One common problem of this is when you have some form controls on your page, and the user might 
have started to enter some data into them while still working with the static DOM. When Ember
has rerendered your application, all that entered data will be lost! Also any previously focused
input will have lost its focus.

## The Solution

This addon will workaround this problem, by collecting all the form controls values (currently supported
are `<input>`  and `<textarea>` elements) and the currently focused element just before the static
DOM is destroyed, and reapply those values and the focused state after Ember's first render.

*Note that you have to add `name` attributes to all your form controls, so this addon knows how to 
identify and match them before and after the rerendering!*

## Outlook

At some point in time, the described problem will have been solved by Ember itself, when it starts
to ship with a version of its Glimmer rendering engine that properly supports DOM rehydration, i.e.
it will reuse the existing DOM and thus retain its previous state.

When that happens, this addon can be deprecated. But for the time being it can serve as a stop gap solution.
