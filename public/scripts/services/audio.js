app.service('Audio', function() {
  // playbackControl.setAttribute('disabled', 'disabled');

  // Load an audio track, and
  // decodeAudioData to decode it and stick it in a buffer.
  // Then we put the buffer into the source
  // wire up buttons to stop and play audio
  function play(url) {
    var source;
    var songLength;
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    source = audioCtx.createBufferSource();
    request = new XMLHttpRequest();
    request.open('GET', url, true);
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
        function(e) {
          "Error with decoding audio data" + e.err
        });
    }
    request.send();
    source.start(0);
    // play.setAttribute('disabled', 'disabled');
    // playbackControl.removeAttribute('disabled');
  };
  stop.onclick = function() {
    source.stop(0);
    // play.removeAttribute('disabled');
    // playbackControl.setAttribute('disabled', 'disabled');
  };
  // playbackControl.oninput = function() {
    // playbackValue.innerHTML = playbackControl.value;
  // };

  return {
    play: play
  };

});