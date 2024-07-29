function shortcut($document) {
    return {
        link: function ($scope, $element, $attrs) {
            $document.bind('keydown keypress', function (event) {
                var keyCode = event.which || event.keyCode;
                var key= event.key;
                if (keyCode == $attrs.shortcut && ($attrs.shortcutKey==null || key==$attrs.shortcutKey)) {
                    event.preventDefault();
                    $scope.$apply(function () {
                        if ($attrs.shortcutHandler != null)
                            $scope.$eval($attrs.shortcutHandler, { $event: event });
                        else
                            $scope.$eval($attrs.ngClick, { $event: event });
                    });
                }
            });
        }
    };
}