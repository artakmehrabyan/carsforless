function NotificationService($timeout) {
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: false,
        positionClass: "toast-top-full-width",
        "showDuration": "300",
        "hideDuration": "1000",

    };
    return {
        info: function (title, text) {
            UI.Toaster.info(title, text);
        },
        error: function (title, text) {
            UI.Toaster.error(title, text);
        },
        warn: function (title, text) {
            UI.Toaster.warning(title, text);
        },
        success: function (title, text) {
            UI.Toaster.success(title, text);
        }

    };
}