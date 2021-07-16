function createMicrophoneInputHandler() {
   let mediaRecorder;
   let chunks = [];
   let blob;
   return {
      createMediaRecorderObject: (stream) => {
         mediaRecorder = new MediaRecorder(stream, {
            audioBitsPerSecond: 128000,
            mimeType: 'audio/webm'
         })
         mediaRecorder.ondataavailable = function (evt) {
            chunks.push(evt.data);
            console.log('New audio data chunk recorded')
         }
         console.log("MediaRecorder created")
         console.log(mediaRecorder)
      },
      startRecording: () => {
         mediaRecorder.start();
         p5AudioVisualiser.play();
         console.log(`recorder ${mediaRecorder.state}`)
      },
      endRecording: () => {
         const recordingPlayer = document.getElementById('recording-player');
         const recordingPlayerContainer = document.querySelector('.recording-playback-container');
         p5AudioVisualiser.pause();
         mediaRecorder.stop();

         // Allowing time for the 'dataavailable' event to fire and include the final chunk of recorded audio
         setTimeout(() => {
            blob = new Blob(chunks, { 'type': 'audio/wav; codecs=MS_PCM' });
            recordingPlayer.src = URL.createObjectURL(blob)
            makeVisible(recordingPlayerContainer)
         }, 300)
      },
      mediaRecorderExists: () => mediaRecorder,
      getMediaRecorderState: () => mediaRecorder.state,
      getRecordedAudio: () => blob,
      clearRecorderData: () => {
         chunks = [];
         blob = undefined;
      },
      // For debugging only. To get recorded audio data for analysis, use getRecordedAudio to retrieve it in blob form
      getRecordedChunks: () => chunks
   }
}


// Initialising microphone input handler instance
const microphoneInputHandler = createMicrophoneInputHandler()