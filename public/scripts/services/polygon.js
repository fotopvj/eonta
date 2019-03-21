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
            data
        });
    }

    function update(data) {
        return $http({
            method: 'POST',
            url: 'api/polygons/' + data.id,
            data
        });
    }

    function remove(id) {
        return $http({
            method: 'DELETE',
            url: 'api/polygons/' + id,
        });
    }

    return {
        list,
        get,
        create,
        update,
        remove
    };
});
