function RequestHelper(
    $http,
    $q) {
    var self = {};

    self.Get = function (url, params) {
        var deferred = $q.defer();
        var options = {
            method: "GET",
            url: url,
            params: params,
        };
        $http(options).then(function (response) {
            deferred.resolve(response);
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };
    self.Post = function(url, model) {
        var deferred = $q.defer();
        var options = {
            method: "POST",
            url: url,
            params: model,
            headers: {
                'Content-Type': "application/json; charset=utf-8",
                '__RequestVerificationToken': model.VerificationToken,
                'Captcha': model.Captcha
            }
        };
        $http(options).then(function (response) {
            deferred.resolve(response);
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    return self;
}