function Api(
    $http,
    $q,
    $window,
    $location,
    sessionContext,
    appSettings) {

    var api = {};
    api.Key = sessionContext != null ? sessionContext.Current.ApiKey : "";
    api.Bearer = sessionContext != null ? sessionContext.Current.AccessToken : "";
    
    api.get = function (url, params) {
        var deferred = $q.defer();
        var apiUrl = appSettings.serviceUrl($location) + url;
            var options = {
                method: "GET",
                url: apiUrl,
                params: params,
                headers: {
                    'ApiKey': api.Key,
                    "Authorization": "Bearer " + api.Bearer
                }
            };
            $http(options).then(function (response) {
                deferred.resolve(response);
            }, function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    },
    api.post = function (url, params, userConfig) {
        var deferred = $q.defer();
        var apiUrl = appSettings.serviceUrl($location) + url;
        var options = {
            method: "POST",
            url: apiUrl,
            data: JSON.stringify(params),
            headers: {
                'Content-Type': "application/json",
                'ApiKey': api.Key,
                "Authorization": "Bearer " + api.Bearer
            }
        }
        var opt = angular.extend(options, userConfig);
        $http(opt)
            .then(function (response) {
                deferred.resolve(response);
            }, function (response) {
                deferred.reject(response);
            });
            //success(function (data, status, headers, config) {
            //    deferred.resolve(data);
            //}).
            //error(function (data, status) {
            //    deferred.reject(data);
            //});
        return deferred.promise;
    }
    return api;
};
