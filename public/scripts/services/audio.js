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

    // Other Fix 
(function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (window.AudioContext) {
        window.audioContext = new window.AudioContext();
    }
    var fixAudioContext = function (e) {
        if (window.audioContext) {
            // Create empty buffer
            var buffer = window.audioContext.createBuffer(1, 1, 22050);
            var source = window.audioContext.createBufferSource();
            source.buffer = buffer;
            // Connect to output (speakers)
            source.connect(window.audioContext.destination);
            // Play sound
            if (source.start) {
                source.start(0);
            } else if (source.play) {
                source.play(0);
            } else if (source.noteOn) {
                source.noteOn(0);
            }
        }
        // Remove events
        document.removeEventListener('touchstart', fixAudioContext);
        document.removeEventListener('touchend', fixAudioContext);
    };
    // iOS 6-8
    document.addEventListener('touchstart', fixAudioContext);
    // iOS 9
    document.addEventListener('touchend', fixAudioContext);
})();

    return {
        play: play
    };

});