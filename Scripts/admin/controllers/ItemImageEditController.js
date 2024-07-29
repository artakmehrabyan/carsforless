function ItemImageEditController($rootScope, $scope, $timeout, req, common, appSession, appSettings, $filter, spinnerService, notifyService, itemService, $uibModalInstance, editableObject) {
   
    $scope.Init = function () {
        $scope.EditingImage = editableObject;
        $scope.SetFolder(editableObject.MediaFolder);
    }
    $scope.SetFolder=function(folder) {
        $scope.EditingImage.MediaFolder = folder;
        $scope.EditingImage.MediaFolderDisplay = "/" + $filter("capitalize")(folder);
    }
    
    $scope.Close=function() {
        if ($scope.EditingImage != null) {
            $uibModalInstance.close($scope.EditingImage);
        } else {
            $uibModalInstance.dismiss();
        }
    }
    $scope.SetAsMain=function(isMain) {
        if (isMain) {
            $scope.SetFolder("client");
        }
    }
    $scope.Cancel = function () {
        $uibModalInstance.dismiss();
    }
    $scope.Init();
}