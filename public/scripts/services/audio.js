app.service('Audio', function() {


// define variables
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();    
var source;
var songLength;
var pre = document.querySelector('pre');
var myScript = document.querySelector('script');
var play = document.querySelector('.play');
var stop = document.querySelector('.stop');

// use XHR to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source
function getData() {
  source = audioCtx.createBufferSource();
  request = new XMLHttpRequest();
  request.open('GET', 'public/audio/beat1.ogg', true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
        myBuffer = buffer;
        songLength = buffer.duration;
        source.buffer = myBuffer;

        source.connect(audioCtx.destination);
        source.loop = true;

      },
      function(e){"Error decoding the audio data" + e.err});
  }
  request.send();
}
// Play and stop commands
play.onclick = function() {
  getData();
  source.start(0);
  play.setAttribute('disabled', 'disabled');
  playbackControl.removeAttribute('disabled');

}
stop.onclick = function() {
  source.stop(0);
  play.removeAttribute('disabled');
}

