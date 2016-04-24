app.factory('Polygon', function($http) {

    function list() {
        return $http({
            method: 'GET',
            url: 'polygons/'
        });
    }

    function get(id) {
        return $http({
            method: 'GET',
            url: 'polygons/' + id,
        });
    }

    function create(data) {
        return $http({
            method: 'POST',
            url: 'polygons/',
            data: data
        });
    }

    function update(data) {
        return $http({
            method: 'POST',
            url: 'polygons/' + data.id,
            data: data
        });
    }

    function remove(id) {
        return $http({
            method: 'DELETE',
            url: 'polygons/' + id,
        });
    }

    return {
        list: list,
        get: get,
        create: create,
        update: update,
        remove: remove    
    };
});