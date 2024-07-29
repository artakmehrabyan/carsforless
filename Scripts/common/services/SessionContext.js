function SessionContext($provide) {
    var instance = {};
    instance.Current =null;
    var storage = null;

    instance.SetSession = function (
        userId,
        userName,
        isAdmin,
        isReseller,
        apiKey,
        accessToken,
        isAuthenticated,
        expireTimeInSeconds) {

        var session = {
            UserId: userId,
            UserName: userName,
            IsAdmin: isAdmin,
            IsReseller: isReseller,
            ApiKey: apiKey,
            AccessToken: accessToken,
            IsAuthenticated: isAuthenticated,
            Timestamp: new Date().getTime(),
            ExpireTimeInMilliseconds: expireTimeInSeconds * 1000
        };
        storage.set("session", session);
    };
    instance.Reset = function () {
        var session = {
            UserId: null,
            UserName: null,
            IsAdmin: false,
            IsReseller: false,
            ApiKey: null,
            AccessToken: null,
            IsAuthenticated: false,
            Timestamp: new Date().getTime(),
            ExpireTimeInMilliseconds: null
        };
        storage.set("session", session);
        instance.Current = session;
    };
    instance.IsAuthenticated = function() {
        var session = instance.Current;
        return session.IsAuthenticated;
    }

    instance.$get = function (localStorageService) {
        storage = localStorageService;
        var session = localStorageService.get("session");
        if (session == null || (session.ExpireTimeInMilliseconds != null && new Date().getTime() > session.Timestamp + session.ExpireTimeInMilliseconds)) {
            instance.Reset();
        } else {
            instance.Current = session;
        }
        return instance;
    };
    return instance;
}