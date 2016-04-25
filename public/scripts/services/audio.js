app.service('Audio', function() {
    'use strict';
    // Load an audio track, and
    // decodeAudioData to decode it and stick it in a buffer.
    // Then we put the buffer into the source
    // wire up buttons to stop and play audio
    function play(url) {
        var songLength;
        var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        var source = audioCtx.createBufferSource();
        var request = new XMLHttpRequest();

        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            var audioData = request.response;
            audioCtx.decodeAudioData(audioData, function(buffer) {
                    songLength = buffer.duration;
                    source.buffer = buffer;
                    source.connect(audioCtx.destination);
                    source.loop = true;
                },
                function(e) {
                    'Error with decoding audio data' + e.err
                });
        }
        request.send();
        source.start(0);

        function stop() {
            source.stop(0);
        }

        return stop;
    }

    return {
        play: play
    };

});