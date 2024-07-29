function ItemImagesController($rootScope, $scope, $q, $timeout, req, common, FileUploader, appSession, appSettings, $filter, spinnerService, notifyService, itemService) {
    var uploader = $scope.uploader = new FileUploader({
        queueLimit: 5,
        removeAfterUpload: true,
        autoUpload: true,
    });

    $scope.dragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        },
        itemMoved: function (event) {
            var media = $scope.Medias[event.source.index];
        },
        orderChanged: function (event) {
            $scope.ApplyOrder();
            $scope.UpdateMediaOrders()
                .then(function (result) {

                });
        },
        //containment: '#images',
    };

    $scope.Medias = [];
    $scope.RemoveMedia = function (media) {
        var index = $scope.Medias.indexOf(media);
        if (index !== -1) {
            $scope.Medias.splice(index, 1);
        }
        $scope.ApplyOrder();
    };
    $scope.ApplyOrder = function () {
        for (var i = 0; i < $scope.Medias.length; i++) {
            var media = $scope.Medias[i];
            media.OldOrder = media.MediaOrder;
            media.MediaOrder = i + 1;
        }
    }

    $scope.UpdateMediaOrders = function () {
        var deferred = $q.defer();
        itemService.UpdateMediaOrders($scope.Medias).then(function (response) {
            var data = common.ResolveData(response);
            if (common.IsValidResponse(data) && data) {
                deferred.resolve(true);
            } else {
                deferred.resolve(false);
            }
        }, function (response) {
            deferred.resolve(false);
        });
        return deferred.promise;
    }
    $scope.SaveMedia = function (media) {
        media.ItemId = $scope.EditableObject.Id;
        var promise = itemService.UpdateMedia(media).then(function (response) {
            var data = common.ResolveData(response);
            if (common.IsValidResponse(data)) {
                var updatedMedia = data[0];
                if (updatedMedia != null) {
                    media.MediaFolder = updatedMedia.MediaFolder;
                }
                var mainImage = data[1];
                if (mainImage != null) {
                    $scope.EditableObject.ImageUrl = mainImage;
                }
                $scope.LoadImageByFolder($scope.ImageCat);
            }
            //notifyService.info("Saving", "Media has been successfully saved!");
            common.StopLoadingResponse(response, true, $scope, false);
        }, function (response) {
            common.StopLoadingResponse(response, true, $scope, false);
        });
        spinnerService.during(promise);
    }
    $scope.OpenMediaEditDialog = function (media) {
        media.SetAsMainImage = $scope.EditableObject.ImageUrl == media.MediaPath;
        common.OpenDialog(appSettings.Admin_Item_ItemImageEditViewUrl, "ItemImageEditController", media, function (result) {
            $scope.SaveMedia(result);
            media.MediaFolder = result.MediaFolder;
        });
    }
    $scope.DeleteImage = function (media) {
        common.Confirm("Delete?", function () {
            var mdl = {
                itemId: $scope.ItemId,
                mediaId: media.MediaId
            };

            var promise = req.Post(appSettings.Admin_Item_DeleteImageUrl, mdl).then(function (resp) {
                if (resp!=null) {
                    $scope.RemoveMedia(media);
                }
                $scope.EditableObject.ImageUrl = resp.data;
            });
            spinnerService.during(promise);
        });
    }
    $scope.SetAsMainImage = function (picUrl) {
        itemService.SetAsMainImage($scope.EditableObject.Id, picUrl).then(function (resp) {
            if (resp) {
                $scope.EditableObject.ImageUrl = picUrl;
                notifyService.info("Set As Main Picture", "Picture has been set as main picture");
            }
        });
    }
    $scope.AddUploadedItem = function (fileItem, response) {
        var item = {
            MediaId: response.MediaId,
            MediaName: response.MediaName,
            MediaPath: response.MediaPath,
            MediaFolder: response.MediaFolder,
        };
        //$scope.Medias.splice(0, 0, item);
        $scope.Medias.push(item);
    }
    $scope.SetCurrentFolder = function (folder) {
        $scope.ImageCat = folder;
        $scope.ItemId = $scope.EditableObject.Id;
        $scope.uploader.url = '/admin/item/uploadimage?itemId=' + $scope.ItemId + "&folder=" + $scope.ImageCat;
        $scope.LoadImageByFolder($scope.ImageCat);
    }
    $scope.InitMedia = function () {
        $scope.ImageCat = 'client';
        $scope.ItemId = $scope.EditableObject.Id;
        $scope.uploader.url = '/admin/item/uploadimage?itemId=' + $scope.ItemId + "&folder=" + $scope.ImageCat,
        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            spinnerService.show();
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            //console.info('onCompleteItem', fileItem, response, status, headers);
            if (status === 200 && response != null && response.MediaName != null) {
                $scope.AddUploadedItem(fileItem, response);
            } else {
                //notifyService.warn("Error when uploading image, check error details in browser console");
                common.HandleError(response, true);
            }

        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
            spinnerService.hide();
        };


        $scope.LoadImageByFolder($scope.ImageCat);
        $scope._initialized = true;
    }
    $scope.LoadingImages = false;
    $scope.LoadImageByFolder = function (folder) {
        if ($scope._initialized == true)
            spinnerService.show();
        $timeout(function () {
           
            $scope.LoadingImages = true;
            if ($scope.Medias != null) {
                $scope.Medias.length = 0;
            }
            $timeout(function () {
                if ($scope.Medias == null) {
                    $scope.Medias = [];
                }
                
                var data = $filter("filter")($scope.EditableObject.MediaList, {
                    MediaSize: "lg",
                    MediaFolder: folder
                });
                $scope.Medias = $filter("orderBy")(data, 'MediaOrder');
                if ($scope.Medias == null) {
                    $scope.Medias = [];
                }
                if ($scope._initialized == true)
                spinnerService.hide();
                $scope.LoadingImages = false;

            }, 500);
        }, 0);
    }

    $scope.UploadFiles = function () {
        var fileInput = angular.element("#fileElem");
        fileInput.click();
    }
    $rootScope.$on("ItemLoaded", function () {
        $scope.InitMedia();
    });

}