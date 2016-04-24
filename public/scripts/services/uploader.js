app.service('Uploader', function() {

    function makeUrl(filename) {
        return 'https://eonta.s3.amazonaws.com/' + filename;
    }

    function sign_request(file, done) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/sign?file_name=' + file.name + '&file_type=' + file.type);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                done(response);
            }
        }
        xhr.send();
    }

    function upload(file, signed_request, url, done) {
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', signed_request);
        xhr.setRequestHeader('x-amz-acl', 'public-read')
        xhr.onload = function() {
            if (xhr.status === 200) {
                done();
            }
        }
        xhr.send(file);
    }

    return {
        makeUrl: makeUrl,
        sign_request: sign_request,
        upload: upload
    };

});