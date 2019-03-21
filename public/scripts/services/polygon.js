app.factory('Polygon', function($http) {

    function list(room) {
        return $http({
            method: 'GET',
            url: 'api/polygons/' + room
        });
    }

    function get(id) {
        return $http({
            method: 'GET',
            url: 'api/polygons/' + id,
        });
    }

    function create(data) {
        return $http({
            method: 'POST',
            url: 'api/polygons/',
            data: data
        });
    }

    function update(data) {
        return $http({
            method: 'POST',
            url: 'api/polygons/' + data.id,
            data: data
        });
    }

    function remove(id) {
        return $http({
            method: 'DELETE',
            url: 'api/polygons/' + id,
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