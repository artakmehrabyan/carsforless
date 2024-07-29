function SpinnerService($timeout, $busy) {
    return {
       /* show: function (elementId) {
            if (elementId != null) {
                UI.Spinner.BlockUI({ target: elementId, boxed: true });
            } else UI.Spinner.BlockUI({ boxed: true });

        },
        hide: function (elementId) {
            if (elementId != null) {
                UI.Spinner.UnblockUI({ target: elementId, boxed: true });
            } else
                UI.Spinner.UnblockUI();
        },*/

        show: function (elementId, loadingText) {
            /*  if (elementId != null) {
                  App.blockUI({ target: elementId, boxed: true });
              } else App.blockUI({ boxed: true, fadeIn: 0 });*/
            $busy.beBusy();

        },
        hide: function (elementId, doneText) {
            /* if (elementId != null) {
                 App.unblockUI({ target: elementId, boxed: true, fadeIn: 0 });
             } else
                 App.unblockUI();*/

            $busy.beFree();
        },
        during:function(promise) {
            return $busy.during(promise);
        }
    };
};