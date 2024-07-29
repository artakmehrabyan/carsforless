
function ContactController(
    $q,
    $http,
    $scope,
    $window,
    authService,
    appSession,
    appSettings,
    notifyService,
    spinnerService,
    common,
    req) {

    $scope.model = {};
    $scope.SendEmail = function (model) {
        req.Post("/home/contactus", model).then(function (res) {
            var data = common.ResolveData(res);
            if (common.IsValidResponse(data) && data == true) {
                notifyService.success("Sent", "Your message has been sent!");
            }
        },function(resp) {
            common.StopLoadingResponse(resp, false, $scope, true);
        });
    }
}