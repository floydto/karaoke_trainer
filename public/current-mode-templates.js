//  Components
/* Template format:
    {
        [key: number] : {
            template: string,
            init?: () => void
            teardown?: () => void
        }
    }
    Keys for each component are stored in the templateEnum variable for easy reference
    template: HTML template for component
    init: initialisation function for new page (adds event listeners etc.). Is called after the new template is rendered
    teardown: teardown function for current page (remove event listener etc.). Is called before switching to new template
*/


const templates = new Map([
    [templateEnum.selectionMenu, {
        template: `
        <div class='selection-menu'>
            <div class="curator_title_wrapper">
                <div class="curator_line"></div>
                    <div class="curator_title">Your AI Karaoke Trainer</div>
                <div class="curator_line"></div>
            </div>
            
            <div
                class='large custom-button' 
                data-action='${methodsEnum.toggleInterface} ${templateEnum.compareTwoFiles}'>
                Upload two audio files for comparison
            </div>
            <div
                class='large custom-button'
                data-action='${methodsEnum.toggleInterface} ${templateEnum.compareFileAndMicrophoneInput}'>
                Compare your voice against an audio file
            </div>
            <div
                class='large custom-button'
                data-action='${methodsEnum.toggleInterface} ${templateEnum.compareYoutubeVideoAndMicrophoneInput}'>
                Sing along to a Youtube video
            </div>
        </div>
    ` }],

    [templateEnum.compareTwoFiles, {
        template: `
        <div class="curator_title_wrapper">
            <div class="curator_title">Upload two audio files for comparison</div>        
        </div>
        
        
        <form id='audio-upload-form'>
            <div class='form-element hidden prompt-container'>
            </div>

            <div class='form-element'>
                <div class='vertical form-element'>
                    <label for='upload-reference'>
                        <div class='upload-reference
                                medium custom-button'> 
                            Upload audio file
                        </div>
                    </label>
                    <div class='hidden upload-reference audio-player-container'>
                        <audio controls class='upload-reference audio-player'>
                        </audio>
                    </div>
                    <input type="file" 
                        id='upload-reference'
                        class='hidden-file-input'
                        accept='audio/wav'
                        name="reference"/>
                </div>
                <div class='vertical form-element'>
                    <label for='upload-recording'>
                        <div class='upload-recording 
                            medium custom-button'> 
                            Upload audio file
                        </div>
                    </label>
                    <div class='hidden upload-recording audio-player-container'>
                        <audio controls class='upload-recording audio-player'>
                        </audio>
                    </div>
                    <input type="file" 
                        id='upload-recording'
                        class='hidden-file-input'
                        accept='audio/wav'    
                        name="recording"/>
                </div>
            </div>
            <div class='text-input-element'>
                Audio Name
                <input type='text' 
                    name='title'
                    placeholder='Name this recording' />
            </div>
            <div class='text-input-element'>
                Notes
                <textarea
                    name='notes'
                    value=''
                    placeholder='Your notes here'></textarea>
            </div>
            <div class='form-element'>
                <div class='small custom-button'
                    data-action='${methodsEnum.uploadAudioFiles}'>
                    Upload
                </div>
                <div class='small custom-button' 
                    data-action='${methodsEnum.toggleInterface} ${templateEnum.reportsList}'>
                    Reports
                </div>
                <div class='small custom-button' 
                    data-action='${methodsEnum.toggleInterface} ${templateEnum.selectionMenu}'>
                    Back
                </div>
            </div>
        </form>
    `,
        init: () => {
            const uploadRecording = document.getElementById('upload-recording')
            uploadRecording.addEventListener('change', mountUploadedAudio)
            const uploadReference = document.getElementById('upload-reference')
            uploadReference.addEventListener('change', mountUploadedAudio)
        },
        teardown: () => {
            const uploadRecording = document.getElementById('upload-recording')
            uploadRecording.removeEventListener('change', mountUploadedAudio)
            const uploadReference = document.getElementById('upload-reference')
            uploadReference.removeEventListener('change', mountUploadedAudio)
            submissionPending = false;
        }
    }],
    [templateEnum.compareFileAndMicrophoneInput, {
        template: `
        <div class="curator_title_wrapper">
            <div class="curator_title">Compare your voice against an audio file</div>        
        </div>

        <div class='audio-form-element hidden prompt-container'>
        </div>

        <form id='audio-upload-form'>
            <div class='voiceComparewithAudio-comparison-container'>
            <div class='audio-form-element'>
                <div class='form-element'>
                    <label for='upload-reference'>
                        <div
                            class='upload-reference medium custom-button'> 
                            Upload an Audio
                        </div>
                    </label>
                    <input type="file" 
                        id='upload-reference'
                        accept='audio/wav'
                        class='hidden-file-input'
                        name="reference"/>
                </div>

                <div class='hidden audio-player-container upload-reference'>
                    <audio controls class='audio-player upload-reference'>
                    </audio>
                </div>
                
                <div class='form-element'>
                    <div id='record' 
                        class='medium custom-button'
                        data-action='${methodsEnum.toggleRecording}'>
                        Record
                    </div>
                </div>

                <div id='audio-visualiser'></div>

                <div class='hidden recording-playback-container'>
                    <audio controls id='recording-player'>
                    </audio>
                </div>

            </div>    

            <div class='lyricsHandler'>
                <div class='lyrics-result'>
                </div>
                <div class='text-get-lyrics'>
                <div class='text-input-element'>
                     <input type='text' 
                        id='songName-input'
                        placeholder='Enter a Song Name'/>
                    </div>
                <div class='small custom-button'
                    data-action='${methodsEnum.searchSongLyrics}'>
                    Get lyrics
                </div>
                </div>
            </div>
            </div>

            <div class='form-element'>
                        <div class='medium custom-button'
                            data-action='${methodsEnum.uploadFileAndMicrophoneAudio}'>
                                Get analysis
                        </div>
                        <div class='small custom-button' 
                            data-action='${methodsEnum.toggleInterface} ${templateEnum.reportsList}'>
                                Reports
                        </div>
                        <div class='medium custom-button'
                            data-action='${methodsEnum.toggleInterface} ${templateEnum.selectionMenu}'>
                            Back
                        </div>
                    </div>

             
            </div>
        </form> 
        `,
        init: () => {
            const uploadReference = document.getElementById('upload-reference')
            uploadReference.addEventListener('change', mountUploadedAudio)

            if (userMicrophoneStream != undefined) {
                p5AudioVisualiser = new p5(audioVisualiser)
            }
        },
        teardown: () => {
            const uploadReference = document.getElementById('upload-reference')
            uploadReference.removeEventListener('change', mountUploadedAudio)
            submissionPending = false;
        }
    }],
    [templateEnum.analysisReport, {
        template: `
        <div class="curator_title_wrapper">
            <div class="curator_title">Analysis Report</div>        
        </div>

            {{report.content}}
        <div class='medium custom-button'
            data-action='${methodsEnum.toggleInterface} ${templateEnum.selectionMenu}'>
            Back
        </div>
    `}],
    [templateEnum.compareYoutubeVideoAndMicrophoneInput, {
        template: `
        <div class="curator_title_wrapper">
            <div class="curator_title">Compare your voice against a Youtube video</div>        
        </div>
        
            <div class='form-element hidden prompt-container'>
            </div>
        <div class='main-container'>    
            <div class='youtube-comparison-container'>
                <div class='youtube-video-wrapper'>
                    <div class='vertical form-element'>    
                        <div class='text-input-element'>
                            <input type='text' 
                                id='link-input'
                                placeholder='Enter a Youtube link' />
                        </div>   
                        <div class='form-element'>
                            <div class='vertical form-element'> 
                                <div class='small custom-button'
                                    data-action='${methodsEnum.changeEmbeddedVideo}'>
                                    Get video
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <form id='audio-upload-form'
                    class='youtube-playback-controls'>
                    <div class='vertical form-element'>
                        <div class='text-input-element'>
                            Audio Name
                            <input type='text' 
                                name='title'
                                placeholder='Name this recording' />
                        </div>
                    </div>
                    <div id='audio-visualiser'>
                    </div>
                    <div id='record' 
                        class='small custom-button'
                        data-action='${methodsEnum.toggleRecording}'>
                        Record
                    </div>
                    <div class='hidden recording-playback-container'>
                        <audio controls id='recording-player'>
                        </audio>
                    </div>
                    <div class='vertical form-element'>
                        <div class='form-element-option'>
                            <input type='radio' 
                                checked
                                name='playback-sync'
                                value='full-video'>
                            <label for='full-video'>Compare with entire video</label>
                        </div>
                        <div class='form-element-option'>
                            <input type='radio' 
                                name='playback-sync'
                                value='partial-video'>
                            <label for='partial-video'>Begin comparison at: </label>
                            <input type='text' id='youtube-recording-offset' name='recording-offset' value='0:00'>
                        </div>
                    </div>
                </form>
                <!--<div class='lyricsHandler'>
                    <div class='small custom-button'
                        data-action='${methodsEnum.searchSongLyrics}'>
                        Get lyrics
                    </div>
                    <div class='text-input-element'>
                        <input type='text' 
                            id='songName-input'
                            placeholder='Enter a Song Name'/>
                    </div>
                    <div class='lyrics-result'>
                    </div>
                </div>-->
            </div>
            <div class='form-actions'>
                <div class='medium custom-button'
                    data-action='${methodsEnum.uploadYoutubeAndMicrophoneAudio}'>
                        Get analysis
                </div>
                <div class='medium custom-button'
                    data-action='${methodsEnum.toggleInterface} ${templateEnum.selectionMenu}'>
                    Back
                </div>
            </div>    
        </div>
        
    `,
        init: () => {
            if (userMicrophoneStream != undefined) {
                p5AudioVisualiser = new p5(audioVisualiser)
            }
        },
        teardown: () => {
            currentYoutubeVideoLink = undefined;
            submissionPending = false;
        }
    }],
    [templateEnum.awaitingAnalysisReport, {
        template: `
        <div class="curator_title_wrapper">
            <div class="curator_title">Your audio has been submitted for analysis.</div>        
        </div>
        <h2>Come back in a minute when your report is ready :)</h2>
        <div class='loading-screen-container'>
            <div class='form-element'>
                <div class='small custom-button' 
                    data-action='${methodsEnum.toggleInterface} ${templateEnum.reportsList}'>
                    Reports
                </div>
                <div class='medium custom-button'
                    data-action='${methodsEnum.toggleInterface} ${templateEnum.selectionMenu}'>
                    Back
                </div>
            </div>
        </div>
    `}],
    [templateEnum.showPerformaceReport, {
        template: `
        <div class="report-card">
            <h1>- Performance Report -</h1>
            <div id="reportName"></div>
            <div id="score" style="display: none;"></div>
            <div id="resultDisplayBar" ></div>
            <div class="statement"> <span id="statement-high">HIGH Accuracy</span> | <span id="statement-low">LOW Accuracy</span> </div>
            <div class='medium custom-button'
              data-action='${methodsEnum.toggleInterface} ${templateEnum.reportsList}'>
              Back
            </div>
        </div>
    `, init: () => {

            showScore()
            const scoreColor = ["#2A805A", "#36a473", "#5bc998", "#c9dc23", "#e7d318",
                "#d6b329", "#e3965f", "#d97026", "#ba3d74", "#a53667", "#802A50"];
            const displayBar = document.getElementById("resultDisplayBar");
            const fragment = document.createDocumentFragment();
            if (reportData[reportIndex] instanceof Array) {
                reportData[reportIndex].forEach(function (color) {
                    let li = document.createElement("li");
                    li.className = 'colorize'
                    li.style.backgroundColor = scoreColor[color];
                    fragment.appendChild(li);
                })
                displayBar.appendChild(fragment);
            } else {
                displayBar.innerText = reportData[reportIndex]
            }

        }
    }],
    [templateEnum.reportsList, {
        template: `
        <div class="curator_title_wrapper">
            <div class="curator_title">Your Performance Reports</div>        
        </div>
        <div class="outer-container reportList_Display">
            </div>
        <div class='loading-screen-container'>
            <div class='form-element'>
                <div class='medium custom-button'
                    data-action='${methodsEnum.toggleInterface} ${templateEnum.selectionMenu}}'>
                    Back
                </div>
            </div>
        </div>
    `, init: () => {
            getReportData_list()
        }
    }],
    [templateEnum.errorPage, {
        template: `
            <div class="curator_title_wrapper">
                <div class="curator_title">Oops! Something went wrong...</div>        
            </div>
            <div class='error-page-container'>
                The following error has occurred:
                <div class='form-element prompt-container'>
                </div>
                
                <div class='form-element'>
                    Please let our team know about this and we'll work to fix this as soon as we can!
                </div>

            </div>
            
            <div class='form-element'>
                <div class='medium custom-button' 
                    data-action='${methodsEnum.toggleInterface} ${templateEnum.selectionMenu}'>
                    Back
                </div>
            </div>
        `
    }]
])

async function displayErrorPage(error) {
    await toggleInterface(templateEnum.errorPage)
    setTimeout(() => {
        showErrorPrompt(error.message)
    }, 500)

    console.log(error)
}

async function toggleInterface(targetTemplate, templateParams) {
    hideElement(modeInterface)
    setTimeout(() => {
        try {
            let currentInterface = templates.get(currentTemplate)
            if (currentInterface.teardown != undefined) {
                currentInterface.teardown()
            }

            let newInterface = templates.get(parseInt(targetTemplate));
            modeInterface.innerHTML = newInterface.template;
            currentTemplate = parseInt(targetTemplate)

            //  If the template contains an init function, execute it.
            if (newInterface.init != undefined) {
                newInterface.init()
            }
            makeVisible(modeInterface)
        } catch (err) {
            displayErrorPage(err)
        }
    }, 300)
}


