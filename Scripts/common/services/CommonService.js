function CommonService(
    $q,
    $timeout,
    $window,
    $location,
    $anchorScroll,
    appSettings,
    iosAlertView,
    spinnerService,
    notifyService,
    clipboard,
    $uibModal) {

    var self = {};
    self.dialogOptions = {
        backdrop: true,
        windowClass: "modal",
        backdropClass: "modal-backdrop",
        triggerClass: "in",
        backdropFade: false,
        dialogFade: false,
        keyboard: true, // close with esc key
        backdropClick: true,
        controller: "",
        templateUrl: ""
    };


    /*Dialog
    ---------------------------------------------------------------------------------------------*/
    function openDialog(url, controller, editableObject, ok, cancel, options) {
        self.dialogOptions.templateUrl = url;
        self.dialogOptions.controller = controller;
        if (options != null) {
            $.extend(self.dialogOptions, options);
        }
        self.dialogOptions.resolve = {
            editableObject: function () {
                return angular.copy(editableObject);
            }
        };
        var modalInstance = $uibModal.open(self.dialogOptions);
        modalInstance.result.then(ok, cancel);
    };
    self.OpenDialog = function (url, controller, editableObject, ok, cancel, options) {
        openDialog(url, controller, editableObject, ok, cancel, options);
    }
    /*Error handling
    ---------------------------------------------------------------------------------------------*/
    self.IsValidResponse = function (response) {
        if (response == null)
            return false;
        if (response.data != null && response.data.ExceptionMessage != null) {
            return false;
        }
        if (response.ExceptionMessage != null) {
            return false;
        }
        return true;
    };
    self.ResolveData = function (response) {
        if (response == null)
            console.log(response)
        if (response.data != null) {
            if (response.data.Results != null) {
                return response.data.Results;
            }
            return response.data;
        }
        return response;
    }
    self.LoadMore = function (data, visibleData, take) {
        if (data != null && data.length > 0 && visibleData != null) {
            var last = visibleData.length;
            var limit = last + take;
            if (limit > data.length)
                limit = data.length;
            for (var i = last; i < limit; i++) {
                visibleData.push(data[i]);
            }
        }
    }
    self.HandleError = function (response, showToUser) {
        if (response == null) {
            console.log("handleError:Response is null");
            return;
        }
        if (response.ModelState != null) {
            //show validation errors
            var errors = [];
            var str = "";
            for (var key in response.ModelState) {
                for (var i = 0; i < response.ModelState[key].length; i++) {
                    //errors.push(response.ModelState[key][i]);
                    str = response.ModelState[key][i];
                }
            }
            if (showToUser === true) {
                notifyService.warn("Validation errors", str);
            }
        } else if (response.data != null && response.data.ExceptionMessage != null && response.data.ExceptionMessage != undefined) {
            console.log(response.data.ExceptionMessage);
            if (showToUser === true) {
                notifyService.error("Error", response.data.ExceptionMessage);
            }
        } else if (response.ExceptionMessage != null && response.ExceptionMessage != undefined) {
            console.log(response.ExceptionMessage);
            if (showToUser === true) {
                notifyService.error("Error", response.ExceptionMessage);
            }
        } else if (response.Message != null) {
            console.log(response.Message);
            if (showToUser === true) {
                notifyService.error("Error", response.Message);
            }
            /*if (response.Message.indexOf("Authorization") >= 0) {
                    $window.location.href = "/account/login";
                }*/
        }
        else if (response.Errors != null) {
            angular.forEach(response.Errors, function (er) {
                if (showToUser === true) {
                    if (er.IsWarning == true) {
                        notifyService.warn("Warning", er.Message);
                    } else {
                        notifyService.error("Error", er.Message);
                    }
                }
            });

        }
    };
    self.GetCurrentDate=function() {
        return new Date();
    }
    self.GetResponseMessage = function (response) {
        
        var message = "";
        if (response == null) {
            console.log("handleError:Response is null");
            return null;
        }
        var errs = "";
        var str;
        if (response.ModelState != null) {
            //show validation errors
            var errors = [];
            str = "";
            for (var key in response.ModelState) {
                for (var i = 0; i < response.ModelState[key].length; i++) {
                    //errors.push(response.ModelState[key][i]);
                    str += response.ModelState[key][i];
                }
            }
            message = str;
        }
        else if (response.data != null) {
            if (response.data.ExceptionMessage != null) {
                message = response.data.ExceptionMessage;
            }
            else if (response.data.ModelState != null) {
                var modelState = response.data.ModelState;
                str = "";
                for (var key in modelState) {
                    for (var i = 0; i < modelState[key].length; i++) {
                        //errors.push(response.ModelState[key][i]);
                        str += modelState[key][i];
                    }
                }
                message = str;
            }
            else if (response.data.Message != null) {
                message = response.data.Message;
            }
            if (response.data.Errors != null) {
                errs = "";
                angular.forEach(response.data.Errors, function (er) {
                    errs += "<br>" + er.Message;
                });
                message = errs;
            }

        } else if (response.ExceptionMessage != null) {
            message = response.ExceptionMessage;
        } else if (response.Message != null) {
            message = response.Message;
        } else if (response.Errors != null) {
            errs = "";
            angular.forEach(response.Errors, function (er) {
                errs += "<br>" + er.Message;
            });
            message = errs;
        }

        return message;
    };
    self.NotifyError = function (title, message) {
        if (title == null)
            title = appSettings.AppName;
        notifyService.error(title, message);
    }
    self.NotifyInfo = function (title, message) {
        if (title == null)
            title = appSettings.AppName;
        notifyService.info(title, message);
    }
    /*Math 
    ---------------------------------------------------------------------------------------------*/
    self.CountPercent = function (amount, percent) {
        return amount * percent / 100;
    }

    /* Strings 
    ---------------------------------------------------------------------------------------------*/
    self.ToCase = function (changeCase, inputStr) {
        return $filter(changeCase)(inputStr);
    };
    self.ToLowercase = function (inputStr) {
        return self.ToCase("lowercase", inputStr);
    };
    self.ToUppercase = function (inputStr) {
        return self.ToCase("uppercase", inputStr);
    };

    /* Array
    ---------------------------------------------------------------------------------------------*/
    self.CopyTo = function (source, destination, deep) {
        if (deep) {
            angular.copy(source, destination);
        } else {
            angular.extend(destination, source);
        }
    };
    self.CopyToArray = function (source, to) {
        to.length = 0;
        to.push.apply(to, source);
    }

    /* General
    ---------------------------------------------------------------------------------------------*/
    self.Delay = function (milliseconds) {
        var deferred = $q.defer();
        $timeout(deferred.resolve, milliseconds);
        return deferred.promise;
    }
    self.WhenAll = function (tasks) {
        return $q.all(tasks);
    }
    self.ExecuteAfter = function (exec, delay) {
        $timeout(exec, delay);
    }
    self.ExecuteUntilTrue = function (exec, contition) {
        while (contition() == false) {
            exec();
        }
    }
    self.GetQueryStringValue = function (name) {
        var match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };
    self.AddQueryStringParam = function (key, value,reload) {
        key = escape(key); value = escape(value);

        var kvp = document.location.search.substr(1).split('&');
        if (kvp == '') {
            document.location.search = '?' + key + '=' + value;
        }
        else {

            var i = kvp.length; var x; while (i--) {
                x = kvp[i].split('=');

                if (x[0] == key) {
                    x[1] = value;
                    kvp[i] = x.join('=');
                    break;
                }
            }

            if (i < 0) { kvp[kvp.length] = [key, value].join('='); }
            var newUrl=kvp.join('&');
            if (reload) {
                //document.location.search = newUrl;
            } else {
                window.History.replaceState({}, document.title, newUrl);
            }
        }
    }
    self.ScrollToBottom = function () {
        var old = $location.hash();
        $location.hash("exit-offscreen");
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    };
    self.StartLoading = function (scope, showSpinner) {
        scope.IsLoading = true;
        if (showSpinner) {
            spinnerService.show();
        }
    }
    self.StopLoading = function (message, success, scope) {
        scope.Message = message;
        scope.Succeeded = success;
        scope.IsLoading = false;
    }
    self.StopLoadingResponse = function (resp, success, scope, showMessages) {
        var message = self.GetResponseMessage(resp);
        self.StopLoading(message, success, scope);
        spinnerService.hide();
        if (showMessages && message != null) {
            notifyService.error(message);
        }
    }
    self.CloseWindow = function () {
        setTimeout(function () {
            $window.close();
        }, 100);
    }
    self.GoTo = function (url) {
        $window.location.href = url;
    }
    self.OpenWindow = function (url) {
        $window.open(url, '_blank');
    }
    self.GoToRouteUrl = function (url) {
        $location.path(url);
    }
    self.GoBack = function () {
        setTimeout(function () {
            $window.history.back();
        }, 100);
    }
    self.IsPageInFrame = function () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    self.GetHostUrl = function () {
        var absUrl = $location.host();
        return absUrl;
    }
    self.GoToRelativeUrl = function (relativeUrl) {
        $window.location.href = relativeUrl;
    }
    self.RedirectWithDelay = function (url, delay) {
        if (delay == null)
            delay = 2000;
        $timeout(function () {
            $window.location.href = url;
        }, delay);
    }
    self.Confirm = function (message, resolved, rejected) {
        return iosAlertView.confirm(message).then(resolved, rejected);
    }
    self.RandomString = function () {
        return Math.random().toString(36).substr(2); // remove `0.`
    };
    self.RandomInt = function (min,max) {
        return Math.random() * (max - min) + min; // remove `0.`
    };
    self.NewToken = function () {
        return self.RandomString() + self.RandomString(); // to make it longer
    };

    self.NewGuid = function () {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();; //use high-precision timer if available
        }
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    self.CopyToClipboard = function (data) {
        clipboard.copyText(data);
    }
    self.CopySelectionToClipboard = function () {
        var data = self.GetSelectionText();
        clipboard.copyText(data);
    }
    self.GetSelectionText = function () {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    };
    self.FocusElement = function (selector) {
        angular.element(selector).focus();
    }
    self.Join = function (source, property, separator) {
        if (separator == null)
            separator = ", ";
        var str = "";
        for (var i = 0; i < source.length; i++) {
            str += source[i][property];
            if (i < source.length - 1) {
                str += separator;
            }
        }
        return str;
    }
    self.GetCurrentUrlWithoutQueryString = function () {
        var loc = window.location;
        var withoutQuery = loc.hostname + loc.pathname;
        return withoutQuery;
    }
    self.PrintPreview=function() {
        window.print();
    }

    
    function ArrayToCsv(JSONData, ReportTitle, ShowLabel){
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            var CSV = '';    
            //Set Report title in first row or line
    
            CSV += ReportTitle + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";
        
                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
            
                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }

                row = row.slice(0, -1);
        
                //append Label row with line break
                CSV += row + '\r\n';
            }
    
            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";
        
                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);
        
                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {        
                alert("Invalid data");
                return;
            }   
        return CSV;
    }
    self.ExportData = function (title,filename, data, format) {
        
        var json = ArrayToCsv(data, title, true);
        var type = "text/csv;charset=utf-8;";
        if (format == "csv") {
            type = "text/csv;charset=utf-8;";
        }else if (format == "txt") {
            type = "text/txt;charset=utf-8;";
        }
        else if (format == "pdf") {
            type = "application/pdf";
        }else if (format == "xls") {
            type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";
        }
        var blob = new Blob([json], { type: type });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
   self.IsNullOrEmpty=function(val) {
       return val==null || val=='';
   }

    self.ReadFile = function (file) {
        var deferred = $q.defer(),
            reader = new $window.FileReader();

        reader.onload = function (ev) {
            var content = ev.target.result;
            deferred.resolve(content);
        };
        reader.readAsText(file);
        return deferred.promise;
    };
    self.OpenFile = function (accept,then) {  // this function must be called from  a user
        var inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.accept = accept;
        inputElement.addEventListener("change", function (event) {
            var file = event.target.files[0];
            self.ReadFile(file).then(then);
        });
        inputElement.dispatchEvent(new MouseEvent("click"));
    }
    self.ReloadPage = function (clearCache) {
        location.reload(clearCache);
    }
    return self;
};