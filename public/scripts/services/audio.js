app.service('Audio', function() {
    'use strict';
    // Load an audio track, and
    // decodeAudioData to decode it and stick it in a buffer.
    // Then we put the buffer into the source
    // wire up buttons to stop and play audio
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

    function play(url) {

        var sound = new Howl({
            src: [url],
            loop: true
        });

        var id = sound.play();

        // var songLength;
        // var source = audioCtx.createBufferSource();
        // var request = new XMLHttpRequest();
        // var gainNode = audioCtx.createGain();

        // request.open('GET', url, true);
        // request.responseType = 'arraybuffer';
        // request.onload = function() {
        //     var audioData = request.response;
        //     audioCtx.decodeAudioData(audioData, function(buffer) {
        //             songLength = buffer.duration;
        //             source.buffer = buffer;
        //             gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        //             source.loop = true;

        //             source.connect(gainNode);
        //             gainNode.connect(audioCtx.destination);
        //             gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 2)
        //         },
        //         function(e) {
        //             console.log('Error with decoding audio data', e);
        //         });
        // }
        // request.send();
        // source.noteOn ? source.noteOn(0) : source.start(0);

        function stop() {

        //  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2);
            setTimeout(function() {
                sound.stop()
            }, 3000);

            sound.fade(1,0,3000, id);

        }

        return stop;
    }

    var allowedTypes = {
        'audio/mpeg': true,
        'audio/x-m4a': true,
        'audio/ogg': true,
        'audio/mp3': true
    };

    function allowedType(type) {
        if (allowedTypes[type]) return true;
        return false;
    }

    return {
        play,
        allowedType
    };

});