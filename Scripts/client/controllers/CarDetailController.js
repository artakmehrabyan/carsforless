function CarDetailController(
    $controller,
    $scope,
    $filter,
    authService,
    appSession,
    common,
    appSettings,
    spinnerService,
    itemService,
    $timeout) {

    $scope.Init = function () {
        $scope.Options.Notification.ShowAsPopup = true;
        $scope.Car = {};
        var id = common.GetQueryStringValue("id");
        
        itemService.GetItem(id).then(function (response) {
            var resp = common.ResolveData(response);
            //$scope.Car = resp.Entity;
            common.CopyTo(resp.Entity, $scope.Car, true);
            if ($scope.Car.Options != null) {
                $scope.Car.Features = common.Join($filter('filter')($scope.Car.Options, { Category: 'Features' }), "Name");
                $scope.Car.Safety = common.Join($filter('filter')($scope.Car.Options, { Category: 'Safety' }), "Name");
                $scope.Car.Comfort = common.Join($filter('filter')($scope.Car.Options, { Category: 'Comfort' }), "Name");
                $scope.Car.Other = common.Join($filter('filter')($scope.Car.Options, { Category: 'Other' }), "Name");
            }
            $scope.Car.Medias = [];
            var sm = $filter('filter')($scope.Car.MediaList, { MediaSize: 'lg' });
            
            if (sm != null) {
                for (var s = 0; s < sm.length; s++) {
                    var smImage = sm[s];
                    if (smImage != null) {
                        $scope.Car.Medias[s] = {
                            sm: smImage.MediaName,
                            md: $scope.GetImageSizeEquivalent(smImage.MediaName, "md"),
                            lg: $scope.GetImageSizeEquivalent(smImage.MediaName, "lg"),
                            MediaFolder:smImage.MediaFolder,
                            hasImage: true,
                            MediaOrder: smImage.MediaOrder,
                        }
                    } else {
                        $scope.Car.Medias[s] = $scope.GetDefaultImages();
                    }
                }
            } else {
                $scope.Car.Medias[0] = {
                    hasImage: false,
                    MediaOrder: 1,
                }
            }
            $timeout(function () {
                App.Details.InitMedia(sm != null, sm != null, sm != null);
            }, 100);
        });
    }
    $scope.GetDefaultImages=function() {
        return {
            sm: "no-car-image-sm.jpg",
            md: "no-car-image-md.jpg",
            lg: "no-car-image-lg.jpg",
            hasImage: false,
    };
    }
    $scope.GetImageSizeEquivalent=function(mediaName,size) {
        var index = mediaName.indexOf('~')+1;
        var crs = mediaName.substr(index, 2);
        
        var name = mediaName.replace(crs, size);
        var found = $filter("filter")($scope.Car.MediaList, { MediaName: name });
        if (found.length>0)
            return found[0].MediaPath;
        return $scope.AppServices.Management.GetImageUrl("no-car-image-"+size+".jpg");
    }
    
    $scope.Init();
   
}