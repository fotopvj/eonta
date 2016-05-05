app.service('Audio', function() {
    'use strict';
    // Load an audio track, and
    // decodeAudioData to decode it and stick it in a buffer.
    // Then we put the buffer into the source
    // wire up buttons to stop and play audio
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

    function play(url) {
        var songLength;
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
                    console.log('Error with decoding audio data',e);
                });
        }
        request.send();
        source.noteOn ? source.noteOn(0) : source.start(0);

        function stop() {
            source.stop(0);
        }

        return stop;
    }

    function iOShack() {
        // create empty buffer
        var buffer = audioCtx.createBuffer(1, 1, 22050);
        var source = audioCtx.createBufferSource();
        source.buffer = buffer;

        // connect to output (your speakers)
        source.connect(audioCtx.destination);
        console.log('click runs', source)

        // play the file
        source.noteOn ? source.noteOn(0) : source.start(0);
        window.removeEventListener('touchstart', iOShack);
    }

    window.addEventListener('touchstart', iOShack);

    return {
        play: play
    };

});