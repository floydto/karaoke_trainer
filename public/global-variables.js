
const modeInterface = document.getElementById('current-mode-interface');
let reportData;
let reportIndex;
let reportTitle;


//  Youtube link (www.youtube.com/) of the video currently embedded in the video player
//  Note that this is NOT the data url that is used by the <video> element's src attribute
let currentYoutubeVideoLink;
let currentYoutubeVideoDuration, currentYoutubeVideoMins, currentYoutubeVideoSecs;

let userMicrophoneStream;
let p5MicTestCanvas, p5SpeakerTestCanvas, p5AudioVisualiser;

//  Whether the user has clicked "Get Analysis" and is currently waiting for the server to respond.
//  Used to prevent double-submissions
let submissionPending = false;

let pitchAnalysisReport = {
    inaccuracy: undefined,
    recording_results: undefined,
    song_results: undefined
}

//  The index of the template currently being displayed
const templateEnum = {
    selectionMenu: 0,
    compareTwoFiles: 1,
    compareFileAndMicrophoneInput: 2,
    analysisReport: 3,
    compareYoutubeVideoAndMicrophoneInput: 4,
    awaitingAnalysisReport: 5,
    showPerformaceReport: 6,
    reportsList: 7,
    errorPage: 8
}
let currentTemplate = templateEnum.selectionMenu

//  If an element is meant to trigger a function on click, the index of that
//      function is stored in its "data-action" attribute
const methodsEnum = {
    toggleInterface: 0,
    toggleRecording: 1,
    endRecording: 2,
    uploadAudioFiles: 3,
    changeEmbeddedVideo: 4,
    searchSongLyrics: 5,
    toggleYoutubePlayback: 6,
    uploadFileAndMicrophoneAudio: 7,
    uploadYoutubeAndMicrophoneAudio: 8,
    getReportData_list: 9,
    displayReport:10
}

