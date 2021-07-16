//  Toggles recording state of user microphone
async function toggleRecording() {
    const recordButton = document.getElementById('record');
    if (!microphoneInputHandler.mediaRecorderExists()) {
        if (!userMicrophoneStream) {
            try {
                userMicrophoneStream = await navigator.mediaDevices.getUserMedia({ audio: true })
            } catch (err) {
                showErrorPrompt(`When attempting to record your voice, your browser returned the following error:
                ${err.message}
                Please ensure that your microphone is working and that you have given KTrainer permission to use it.`)
            }
        }
        microphoneInputHandler.createMediaRecorderObject(userMicrophoneStream)
    }

    switch (microphoneInputHandler.getMediaRecorderState()) {
        case "inactive":
        case "paused":
            microphoneInputHandler.startRecording()
            recordButton.innerHTML = 'Stop'
            break;
        case "recording":
            microphoneInputHandler.endRecording()
            recordButton.innerHTML = 'Record'
            break;
        default:
            console.log("Cannot read MediaRecorder state.")
            break;
    }
}


/// Functions governing playback of Youtube content
async function changeEmbeddedVideo() {
    const searchInput = document.getElementById('link-input')
    if (searchInput.value === undefined || searchInput.value === "") {
        return
    }

    const youtubeVideoWrapper = document.querySelector('.youtube-video-wrapper')
    youtubeVideoWrapper.innerHTML = `
            <i id='loading-spinner'
                class="fas fa-sync-alt"></i>
        `

    let input = searchInput.value;
    let res = await fetch(`/youtube?search=${encodeURIComponent(input)}`)
    let videoData = await res.json();

    currentYoutubeVideoLink = videoData.url
    youtubeVideoWrapper.innerHTML = `
            <video id='youtube-video'
                data-action='${methodsEnum.toggleYoutubePlayback}'>
            </video>
            <span id='playback-bar-container'>
                <div id='youtube-playback-button' 
                    data-action='${methodsEnum.toggleYoutubePlayback}'>
                    <i class="fas fa-play"
                        data-action='${methodsEnum.toggleYoutubePlayback}'></i>
                </div>
                <input type='range' id='youtube-playback-bar' name='youtube-playback-bar' 
                    min='0' max='100' value='0'>
                <span id='youtube-playback-timer'>-- : -- / -- : --</span>
            </span>
        `
    const youtubeVideo = document.getElementById('youtube-video');
    youtubeVideo.ondurationchange = (evt) => {
        currentYoutubeVideoDuration = evt.target.duration;
        const timer = document.getElementById('youtube-playback-timer')
        const playbackBar = document.getElementById('youtube-playback-bar')
        let min = Math.floor(currentYoutubeVideoDuration / 60);
        let sec = Math.floor(currentYoutubeVideoDuration % 60);
        if (sec < 10) {
            sec = "0" + sec
        }
        timer.innerText = `0:00 / ${min}:${sec}`
        currentYoutubeVideoMins = min
        currentYoutubeVideoSecs = sec
        playbackBar.addEventListener("change", (evt) => {
            youtubeVideo.currentTime = currentYoutubeVideoDuration * (evt.target.value / 100);
        })
    }
    youtubeVideo.ontimeupdate = (evt) => {
        const timer = document.getElementById('youtube-playback-timer')
        const playbackBar = document.getElementById('youtube-playback-bar')
        let min = Math.floor(evt.target.currentTime / 60);
        let sec = Math.floor(evt.target.currentTime % 60);
        if (sec < 10) {
            sec = "0" + sec
        }
        timer.innerText = `${min}:${sec} / ${currentYoutubeVideoMins}:${currentYoutubeVideoSecs}`
        playbackBar.value = (evt.target.currentTime / currentYoutubeVideoDuration) * 100
    }
    youtubeVideo.src = videoData.video;
    console.log(videoData)
    makeVisible(youtubeVideo)
    searchInput.value = ''
}

function toggleYoutubePlayback() {
    const youtubeVideo = document.getElementById('youtube-video');
    const playbackButton = document.getElementById('youtube-playback-button')
    if (youtubeVideo.paused === true) {
        youtubeVideo.play()
        playbackButton.innerHTML = `<i class="fas fa-pause" data-action='${methodsEnum.toggleYoutubePlayback}'></i>`
    } else {
        youtubeVideo.pause()
        playbackButton.innerHTML = `<i class="fas fa-play" data-action='${methodsEnum.toggleYoutubePlayback}'></i>`
    }
}
///


/// Functions for submitting audio data for analysis
async function uploadAudioFiles() {
    const reference = document.getElementById('upload-reference')
    const recording = document.getElementById('upload-recording')

    if (reference.value === "" || recording.value === "") {
        showErrorPrompt('You must upload two audio files for comparison.')
        return
    }

    const audioUploadForm = document.getElementById('audio-upload-form')
    let reqBody = new FormData(audioUploadForm)
    await submitAudioForAnalysis(reqBody, "/audiofile")
}
async function uploadFileAndMicrophoneAudio() {
    let blob = microphoneInputHandler.getRecordedAudio()

    const reference = document.getElementById('upload-reference')

    if (reference.value === "") {
        showErrorPrompt('You must upload a reference audio files for comparison.')
        return
    } else if (blob === undefined || blob.size === 0) {
        showErrorPrompt('No recorded audio detected. Check to see that your microphone is working and that you have permitted your browser to access it. (you may need to refresh your browser)')
        return
    }

    let reqBody = new FormData(document.getElementById('audio-upload-form'))
    reqBody.append('recording', blob, "microphone_recording")
    await submitAudioForAnalysis(reqBody, "/audiofile")
}
async function uploadYoutubeAndMicrophoneAudio() {
    const audioForm = document.getElementById('audio-upload-form')
    let blob = microphoneInputHandler.getRecordedAudio()

    if (currentYoutubeVideoLink === undefined) {
        showErrorPrompt("You haven't selected a YouTube video yet.")
        return
    } else if (blob === undefined || blob.size === 0) {
        showErrorPrompt('No recorded audio detected. Check to see that your microphone is working and that you have permitted your browser to access it. (you may need to refresh your browser)')
        return
    }
    let reqBody = new FormData(audioForm)
    reqBody.append('recording', blob, "microphone_recording")
    reqBody.append('youtubelink', currentYoutubeVideoLink)
    await submitAudioForAnalysis(reqBody, "/audiolink")
}
async function submitAudioForAnalysis(reqBody, reqpath) {
    //  Submit the formdata only if the user does not already have another submission pending. Prevents double submissions
    if (!submissionPending) {
        submissionPending = true
        try {
            let res = await fetch(reqpath, {
                method: "POST",
                body: reqBody
            })
            let resJSON = await res.json()

            if (resJSON.success === true) {
                toggleInterface(templateEnum.awaitingAnalysisReport)
                submissionPending = false
                //  resJSON.body contains the id of the database record created for this record as well as a hash token for guest users to retrieve their reports later (see audioTypes.RecordCreationResponseBody)
                if (resJSON.body.userLoggedIn === false) {
                    localStorage.setItem(`ktrainer_report${resJSON.body.newRecordID}`, resJSON.body.retrievalToken)
                }
            } else {
                showErrorPrompt(resJSON.error)
                submissionPending = false
            }
        } catch (err) {
            console.log(err)
            submissionPending = false
        }
    } else {
        console.log("Currently processing submission. Please be patient.")
    }
}
////



function callMethod(method, params) {
    switch (method) {
        case methodsEnum.toggleInterface:
            toggleInterface(params[0], params.splice(1))
            break;
        case methodsEnum.toggleRecording:
            toggleRecording()
            break;
        case methodsEnum.endRecording:
            microphoneInputHandler.endRecording()
            break;
        case methodsEnum.uploadAudioFiles:
            uploadAudioFiles()
            break;
        case methodsEnum.changeEmbeddedVideo:
            changeEmbeddedVideo()
            break;
        case methodsEnum.searchSongLyrics:
            searchSongLyrics()
        case methodsEnum.toggleYoutubePlayback:
            toggleYoutubePlayback()
            break;
        case methodsEnum.uploadFileAndMicrophoneAudio:
            uploadFileAndMicrophoneAudio()
            break;
        case methodsEnum.uploadYoutubeAndMicrophoneAudio:
            uploadYoutubeAndMicrophoneAudio()
            break;
        case methodsEnum.displayReport:
            displayReport(params)
            break;
    }
}

async function searchSongLyrics() {
    const song = document.getElementById('songName-input').value

    const lyricsResult = document.querySelector('.lyrics-result')
    lyricsResult.innerHTML = "<div class='Song-lyrics'> Retrieving lyrics from server...</div>"

    try {
        const results = await fetch(`/lyrics/${song}`, {
            method: "POST"
        })
        const lyrics = await results.json()
        if (lyrics.success === true) {
            lyricsResult.innerHTML = ""
            const songTitle = document.createElement('div')
            songTitle.classList.add('Song-title')
            songTitle.innerText = lyrics.title
            lyricsResult.appendChild(songTitle)
            const songLyrics = document.createElement('div')
            songLyrics.classList.add('Song-lyrics')
            songLyrics.innerText = lyrics.lyrics
            lyricsResult.appendChild(songLyrics)
        } else {
            lyricsResult.innerHTML = ""
            const title = document.createElement('div')
            title.classList.add('Song-title')
            title.innerText = `The server has returned the following error when attempting to retrieve the lyrics for ${song}`
            lyricsResult.appendChild(title)
            const errorPrompt = document.createElement('div')
            errorPrompt.classList.add('prompt-container')
            errorPrompt.innerText = lyrics.message
            lyricsResult.appendChild(errorPrompt)
        }
    } catch (e) {
        lyricsResult.innerHTML = `<div class = "Song-lyrics">Oops! Something went wrong!</div>`
        console.log(e)
    }
}

/* Flow:
When user uploads audio:
- If user does not have a token, upload audio. Server generates a token for user to store in localStorage
- If user has a token, upload audio along with the token. Server associates the token with all analysis reports send by owner of that token

When user retrieves reports:
- User sends their locally-stored token to server
- Server returns all reports associated with that token */

async function getReportData_list() {
    const reportList_Display = document.querySelector('.reportList_Display')

    let identifications = getAllLocalStorageTokens() //reports[{recordID:, token:}{reportID:, token:}]

    reportData = []
    for (let i = 0; i < identifications.length; i++) {
        let token = identifications[i].token
        let recordID = identifications[i].recordID
        const recordRes = await fetch(`/report?token=${encodeURIComponent(token)}&record=${encodeURIComponent(recordID)}`, {
            method: "GET"
        });
        const recordResult = await recordRes.json();

        // when song name is null
        reportTitle = '';
        if (recordResult.report.song_name) {
            reportTitle = recordResult.report.song_name
        } else {
            reportTitle = 'Karaoke Training Report'
        }

        if (recordResult.report?.result?.inaccuracy) {
            reportData.push(recordResult.report.result.inaccuracy)
            console.log(reportData)
        } else {
            reportData.push("Your report is not ready yet. Come again later.")
        }

        let date;
        date = recordResult.report.created_at.substring(0, 10)


        // Lists of Reports 
        reportList_Display.innerHTML +=
                `<ul class='report-list'>
            <li class="ui-item" >
                <i class='fas fa-guitar moving-icon'></i>
                <p>${reportTitle}</p>
                <p>${date}</p>
                <i class='fas fa-chevron-right' data-index='${i}' data-action='${methodsEnum.displayReport} ${i}'></i>
            </li>
            </ul>`

        
       

        } // end of for-loop 
        
}


