
/* 
// Header logo-text event listen
document.querySelector('.header .logo-text').addEventListener('click', (evt) => {
  if (evt.target.dataset.action === undefined) {
    evt.stopPropagation();
    return
  } else {
    //  If an element triggers a method on click, the method and its arguments are specified in
    //      the 'data-action' attribute, separated by a space. 
    //  See also method-switch.js and methodsEnum in global-variables.js
    let method = parseInt(evt.target.dataset.action.split(' ')[0]);
    let params = evt.target.dataset.action.split(' ').splice(1);

    callMethod(method, params);
  }
  evt.stopPropagation();
})
//  All form submissions in #current-mode-interface are handled via AJAX
document.querySelector('.header .logo-text').addEventListener('submit', (evt) => {
  evt.preventDefault();
})
 */

function main() {
  //  Page content starts hidden and fades in on load //
  toggleInterface(templateEnum.selectionMenu)
  makeVisible(modeInterface)

  //  Main nav toggles
  document.querySelector('.burger-wrapper').addEventListener('click', toggleMainNav)

  //  Mic and headphone test toggles
  document.querySelector('.test-icon-speak').addEventListener('click', popupHeadphones)
  document.querySelector('.test-icon-mic').addEventListener('click', popupMic)

  //  All menu actions in the '#current-mode-interface' div share the same event listener //
  modeInterface.addEventListener('click', (evt) => {
    if (evt.target.dataset.action === undefined) {
      evt.stopPropagation();
      return
    } else {
      //  If an element triggers a method on click, the method and its arguments are specified in
      //      the 'data-action' attribute, separated by a space. 
      //  See also method-switch.js and methodsEnum in global-variables.js
      let method = parseInt(evt.target.dataset.action.split(' ')[0]);
      let params = evt.target.dataset.action.split(' ').splice(1);

      callMethod(method, params);
    }
    evt.stopPropagation();
  })
  //  All form submissions in #current-mode-interface are handled via AJAX
  modeInterface.addEventListener('submit', (evt) => {
    evt.preventDefault();
  })

  //  Nav event listener
  document.querySelector('.nav #navTrainingReport').addEventListener('click', (evt) => {
    callMethod(0, ["7"]);
  })

  //  Get user microphone and use resulting stream to initalise p5 mic test canvas
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      userMicrophoneStream = stream
      p5MicTestCanvas = new p5(micTesting)
      p5SpeakerTestCanvas = new p5(headphoneTesting)
    })
  } else {
    alert("Your browser does not support the MediaDevices API, which is essential for many of our site's main functions. Please switch to a different browser.")
  }
}
document.onload = main()