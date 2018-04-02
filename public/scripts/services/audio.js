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
        var gainNode = audioCtx.createGain();

        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            var audioData = request.response;
            audioCtx.decodeAudioData(audioData, function(buffer) {
                    songLength = buffer.duration;
                    source.buffer = buffer; 
                    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
                    source.loop = true;
            
                    source.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 2)
                },
                function(e) {
                    console.log('Error with decoding audio data',e);
                });
        }
        request.send();
        source.noteOn ? source.noteOn(0) : source.start(0);


        function stop() {

            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2)
            setTimeout(function() {
                source.stop(0);
            }, 3000);
        }

        return stop;
    }

    // Makes it so audio can play on iOS //
    /*function iOShack() {
        // create empty buffer
        var buffer = audioCtx.createBuffer(1, 1, 22050);
        var source = audioCtx.createBufferSource();
        source.buffer = buffer;

        // connect to output (your speakers)
        source.connect(audioCtx.destination);


        // play the file
        source.noteOn ? source.noteOn(0) : source.start(0);
        window.removeEventListener('touchstart', iOShack);
    }

    window.addEventListener('touchstart', iOShack);
    */

    window.addEventListener('touchstart', function() {

    // create empty buffer
    var buffer = myContext.createBuffer(1, 1, 22050);
    var source = myContext.createBufferSource();
    source.buffer = buffer;

    // connect to output (your speakers)
    source.connect(myContext.destination);

    // play the file
    source.noteOn(0);

}, false);

    return {
        play: play
    };

});