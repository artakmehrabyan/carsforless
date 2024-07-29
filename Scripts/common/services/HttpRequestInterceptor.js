function HttpRequestInterceptorFactory($q,$window,sessionContext) {
    var handleError = function (response) {
        if (response == null) {
            console.log("handleError:Response is null");
            return;
        }
        if (response.data != null && response.data.ExceptionMessage != null && response.data.ExceptionMessage != undefined) {
            console.log(response.data.ExceptionMessage);
        } else if (response.ExceptionMessage != null && response.ExceptionMessage != undefined) {
            console.log(response.ExceptionMessage);
        } else if (response.Message != null) {
            console.log(response.Message);
        }
    };
    return {
        request: function (config) {
            config.headers["X-Requested-With"] = 'XMLHttpRequest';
            return config;
        },
        response: function (rejection) {
            handleError(rejection);
            return rejection || $q.when(rejection);
            //return rejection;
        },
        responseError: function (rejection) {
            handleError(rejection);
            //Authorization failed, redirect to login page
            if (rejection.status === 401) {
                //sessionContext.Reset();
                var url = "/account/logoff";
                $window.location.href = url;
                return;
                
            }
           // return rejection || $q.when(rejection);
            return $q.reject(rejection);
        },

        // On request failure
        requestError: function (rejection) {
            console.log(rejection)
            // Return the promise rejection.
            return $q.reject(rejection);
        }

    };
}
