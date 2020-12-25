// ==UserScript==
// @name         🐅 Theme In-Game Editor for Arras.io 🐅
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Modify the look and feel of your Arras.io game, while you're playing it!
// @author       Road#6943
// @match        *://arras.netlify.app/
// @match        *://arras.io/
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.12
// @require      https://cdn.jsdelivr.net/npm/verte
// @resource     VERTE_CSS https://cdn.jsdelivr.net/npm/verte@0.0.12/dist/verte.css
// @grant        GM_getResourceText
// ==/UserScript==


/*
**
*** TODO:

++ add import/export themes capabilities (make sure its backwards compatible with standard arras themes)
++ a tab for viewing and choosing pre-loaded themes such as the default ones (maybe with mini svg renders like in my random theme maker)
++ add ability to save custom themes, and retrieve them from localStorage on page load
++ buttons for random theme, rainbow changing theme, etc...
++ make separate tabs for graphical/gui/themeColor

***
**
*/


/* IMPORTANT NOTES: use single quotes (') for the majority of stuff as they won't interfere with
** either HTML's " double quotes " or the js string interpolation backticks ``
** Arras() function is what allows this whole thing to work -- gives current theme values and allows you to set new ones */
/* newer Userscript managers use GM.addStyle not GM_addStyle, so I inserted a polyfill further down in the script to deal with this */
var CONTAINER_ID = 'main-container';
var CANVAS_ID = 'canvas';
var LAUNCH_BTN_ID = 'launch-btn';

(function() {
    'use strict';

    // add these css files at the start so that the launch btn can be styled and positioned above canvas from the very start
    // Verte css stuff can't go here because it screws with the Arras landing page styling
    GM_addStyle( getUserscriptSpecificCSS() ); // positions items above canvas
    GM_addStyle( getAppCSS() ); // adds styling for the majority of the Vue app's ui

    var canvas = document.getElementById(CANVAS_ID);

    // add a launch button to launch the main Vue instance, it should look identical to the toggle-btn
    // thanks to their shared .editor-btn class
    canvas.insertAdjacentHTML('beforebegin', `
      <button id="${LAUNCH_BTN_ID}" class="editor-btn">
        🐅 Open 🐅
      </button>
    `);

    document.getElementById(LAUNCH_BTN_ID).onclick = launchApp
})();


// launch the main editor app only if user is in-game (so that the themeColor stuff is actually availiable to grab)
// also destroy the initial launch-btn at the end of this function because it is no longer needed and is replaced with toggle-btn inside the main Vue app
function launchApp() {
  if (!userIsCurrentlyInGame()) {
    alert('You must be in-game to use this!');
    return;
  }

  // remove the launch button, so that the toggle-btn in the Vue instance can take over
  // and also to prevent users from accidently creating multiple Vue instances through multiple clicks
  document.getElementById(LAUNCH_BTN_ID).remove();

  // something in arras's default css styling screws with the top color picker
  // by making it be too wide and overflow from the color picker container
  // so this removes all existing css for just that top slider, so that only Verte's css can style it
  // the width:85% thing is something that I used before to make the slider look correct,
  // but it screwed with the functionality somewhat so I removed it
  /* Verte-related */
  GM_addStyle( '.verte-picker__slider { all: unset;        /* width: 85%; */ }' );

  // add verte css file (color picker styling)
  // Must go here (in-game only, never landing page) because it screws with the Arras landing page styling somehow
  GM_addStyle( GM_getResourceText("VERTE_CSS") );

  var canvas = document.getElementById(CANVAS_ID);
  canvas.insertAdjacentHTML('beforebegin', getAppHTML());
  runAppJS();
}


// a little hack to detect if the user is currently in game or on the main landing page
function userIsCurrentlyInGame() {
  // playerNameInput is disabled in-game, but enabled on the main landing page (because thats how players enter their name)
  return document.getElementById("playerNameInput").hasAttribute("disabled");
}

// this is css that allows the the userscript to properly show the editor above the game canvas
// and anything else that's not used for the actual app functionality (anything that wouldn't go into a codepen of the app)
function getUserscriptSpecificCSS() {
  return `

/* These position the launch button and editor div directly above the canvas */
#${CONTAINER_ID}, #${LAUNCH_BTN_ID} {
  position: absolute;
  z-index: 2;
}
#${CANVAS_ID} {
  position: absolute;
  z-index: 1;
}

`}

// polyfill for GM_addStyle, because it won't work in newer userscript managers
// from https://greasyfork.org/en/scripts/35383-gm-addstyle-polyfill
function GM_addStyle(aCss) {
  'use strict';
  let head = document.getElementsByTagName('head')[0];
  if (head) {
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  }
  return null;
};


// paste the vue js html code into here, but NOT the script tag stuff or the style tag stuff
function getAppHTML() {
  return `
    //INSERT editor_html HERE//
  `
}

function getAppCSS() {
  return `
    //INSERT editor_css HERE//
  `
}

// paste the vue js <script> js </script> code into here
function runAppJS() {

  //INSERT editor_js HERE//
}


