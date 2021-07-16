function makeVisible(element) {
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden')
    }
}

function hideElement(element) {
    if (!element.classList.contains('hidden')) {
        element.classList.add('hidden')
    }
}

function createAudioContext() {
    const audioContext = new AudioContext()
    const analyserNode = audioContext.createAnalyser()
    analyserNode.smoothingTimeConstant = 0.8
    analyserNode.fftSize = 1024;
    return {
        audioContext,
        analyserNode
    }
}


//  Gets all tokens for accessing reports
function getAllLocalStorageTokens() {
    let tokens = []
    let keys = Object.keys(localStorage)
    for (let key of keys) {
        if (key.match(/ktrainer_report/)) {
            tokens.push({
                recordID: key.substring("ktrainer_report".length),
                token: localStorage.getItem(key)
            })
        }
    } return tokens;
    // console.log(reports);
}

//  Shows prompt in <div class='prompt-container'></div> element
function showErrorPrompt(error) {
    let prompt = document.querySelector('.prompt-container')
    if (prompt) {
        hideElement(prompt)
        setTimeout(() => {
            prompt.innerText = error
            makeVisible(prompt)
        }, 300)
    }
}

//  Nav bar toggle //
function toggleMainNav() {
    const nav = document.querySelector('.nav')
    nav.classList.toggle('hidden-nav')
}


//  Setup functions for creating instances of p5 canvas
let micTesting = function (p) {
    let canvas;
    let height = 300;
    let width = 300;
    let mic;
    let micLevel;
    let { audioContext, analyserNode } = createAudioContext()

    p.setup = () => {
        canvas = p.createCanvas(height, width);
        canvas.parent(document.querySelector('#micTest'))
        mic = audioContext.createMediaStreamSource(userMicrophoneStream)
        mic.connect(analyserNode)
    }
    p.draw = () => {
        p.background('#fbf2f1');
        p.fill('#ff50f3');
        let array = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(array);
        let values = 0;
        for (let i of array) {
            values += i;
        }
        let average = values / array.length;
        micLevel = Math.round(average);

        let y = height - micLevel;
        p.ellipse(width / 2, y, 18, 18);
    }
}

let headphoneTesting = function (p) {
    let canvas;
    let height = 300;
    let width = 300;
    const audioElement = document.getElementById('testing-audio-clip')
    audioElement.loop = true
    let { audioContext, analyserNode } = createAudioContext()
    let testSound = audioContext.createMediaStreamSource(audioElement.captureStream())
    testSound.connect(analyserNode)
        .connect(audioContext.destination)

    function togglePlay() {
        if (audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.pause();
        }
    }
    p.setup = () => {
        canvas = p.createCanvas(height, width);
        canvas.parent(document.querySelector('#speakerTest'))
        canvas.mouseClicked(togglePlay);
    }

    p.draw = () => {
        p.background('#fbf2f1');

        let spectrum = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(spectrum);
        p.noStroke();
        p.fill(255, 0, 255);
        for (let i in spectrum) {
            let x = p.map(i, 0, spectrum.length, 20, width - 20);
            let h = -height + p.map(spectrum[i], 0, 255, height, 0);
            p.rect(x, height, width / spectrum.length, h)
        }

        p.stroke(20);
    }
}
let audioVisualiser = function (p) {
    let canvas;
    let height = 80;
    let width = 220;
    let mic;
    let { audioContext, analyserNode } = createAudioContext()

    p.setup = () => {
        canvas = p.createCanvas(width, height);
        canvas.parent(document.querySelector('#audio-visualiser'))
        mic = audioContext.createMediaStreamSource(userMicrophoneStream)
        mic.connect(analyserNode)
        p.noLoop()
    }
    p.draw = () => {
        p.background(0, 0, 0);
        p.fill('#33476a');
        let spectrum = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(spectrum);


        p.noStroke();
        p.fill(255, 0, 255);
        for (let i in spectrum) {
            let x = p.map(i, 0, spectrum.length, 20, width - 20);
            let h = -height + p.map(spectrum[i], 0, 255, height, 0);
            p.rect(x, height, width / spectrum.length, h)
        }
    }
    p.pause = () => {
        p.noLoop()
        p.background(0, 0, 0);
    }
    p.play = () => {
        p.loop()
    }
}


//  Mic Test //
//  When the user clicks on mic, open the popup
function popupMic() {
    let popup = document.getElementById("micTest");
    popup.classList.toggle("show-micTest");
}


//  Speaker Test  //
//  When the user clicks on headphone, open the popup
function popupHeadphones() {
    let popup = document.getElementById("speakerTest");
    popup.classList.toggle("show-playMusic");
}

// When user uploads an audio file, place it in an audio element so users may preview it before submission
const mountUploadedAudio = (evt) => {
    const audioPlayer = document.querySelector(`.audio-player.${evt.target.id}`);
    const audioPlayerContainer = document.querySelector(`.audio-player-container.${evt.target.id}`);
    const uploadButton = document.querySelector(`.${evt.target.id}.custom-button`)
    if (evt.target.value) {
        uploadButton.innerHTML = "Change uploaded file"
        let file = evt.target.files.item(0);
        let reader = new FileReader();
        reader.onload = function () {
            audioPlayer.src = reader.result;
            makeVisible(audioPlayerContainer)
        }
        reader.readAsDataURL(file);
    } else {
        uploadButton.innerHTML = "Upload audio file"
        audioPlayer.src = ""
        hideElement(audioPlayerContainer)
    }
}