var UI = function () {
    var self = this;
    self.Toaster = (function () {
        return {
            warning: function (title, text) {
                toastr.warning(text, title);
            },
            error: function (title, text) {
                toastr.error(text, title);
            },
            success: function (title, text) {
                toastr.success(text, title);
            },
            info: function (title, text) {
                toastr.info(text, title);
            },
            clear:function() {
                toastr.clear();
            }
        };
    })();
    self.Animation = (function () {
        return {
             AnimationHover: function(element, animation) {
                element = $(element);
                element.hover(
                    function() {
                        element.addClass("animated " + animation);
                    },
                    function() {
                        //wait for animation to finish before removing classes
                        window.setTimeout(function() {
                            element.removeClass("animated " + animation);
                        }, 2000);
                    });
            }

        };
    })();
    self.Spinner = (function() {
        return {
            BlockUI: function(options) {
                var options = $.extend(true, {}, options);
                var html = '';
                if (options.iconOnly) {
                    html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img style="" src="/content/img/loading-spinner-grey.gif" align=""></div>';
                } else if (options.textOnly) {
                    html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
                } else {
                    html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img style="" src="/content/img/loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
                }

                if (options.target) { // element blocking
                    var el = jQuery(options.target);
                    if (el.height() <= ($(window).height())) {
                        options.cenrerY = true;
                    }
                    el.block({
                        message: html,
                        baseZ: options.zIndex ? options.zIndex : 1000,
                        centerY: options.cenrerY != undefined ? options.cenrerY : false,
                        css: {
                            top: '10%',
                            border: '0',
                            padding: '0',
                            backgroundColor: 'none'
                        },
                        overlayCSS: {
                            backgroundColor: options.overlayColor ? options.overlayColor : '#000',
                            opacity: options.boxed ? 0.05 : 0.1,
                            cursor: 'wait'
                        }
                    });
                } else { // page blocking
                    $.blockUI({
                        message: html,
                        baseZ: options.zIndex ? options.zIndex : 1000,
                        css: {
                            border: '0',
                            padding: '0',
                            backgroundColor: 'none'
                        },
                        overlayCSS: {
                            backgroundColor: options.overlayColor ? options.overlayColor : '#000',
                            opacity: options.boxed ? 0.05 : 0.1,
                            cursor: 'wait'
                        }
                    });
                }
            },
            UnblockUI: function(target) {
                if (target) {
                    jQuery(target).unblock({
                        onUnblock: function() {
                            jQuery(target).css('position', '');
                            jQuery(target).css('zoom', '');
                        }
                    });
                } else {
                    $.unblockUI();
                }
            }
        };
    })();
    self.Popup=(function() {
        return {
            ShowPopup: function(url, data, success) {
                $.magnificPopup.open({
                    closeOnContentClick: false,
                    closeOnBgClick: false,
                    items: {
                        src: url
                    },
                    type: 'ajax'

                    // You may add options here, they're exactly the same as for $.fn.magnificPopup call
                    // Note that some settings that rely on click event (like disableOn or midClick) will not work here
                }, 0);
                /* $.magnificPopup.open({
                    href: {},
                    callbacks: {
                        open: function() {
                            $.ajax({
                                type: "POST",
                                url: url,
                                data: data,
                                cache: false,
                                success: function(html) {
                                    parent.html(html);
                                    if (success != null) {
                                        
                                    }
                                }
                            });
                        }
                    }
                });*/
            },
            Init: function() {
                $("[data-toggle=tooltip]").tooltip();
                $("[data-toggle=popover]")
                    .popover()
                    .click(function(e) {
                        e.preventDefault();
                    });
            }
        }
    })();
    self.Occordion = (function () {
        return {
            Init: function () {
                $(".ui-accordion a span").click(function () {
                    var link = $(this).parent();
                    if (link.hasClass("selected")) {
                        link.removeClass("selected");
                    } else {
                        link.addClass("selected");
                    }
                });
            }
        }
    })();
    self.Progress = (function () {
        return {
            GetProgressCss: function (percent) {
                var css = "";
                if (percent <= 20) {
                    css = 'red';
                }
                else if (percent > 20 && percent <= 50) {
                    css = '';
                }
                else if (percent > 50 && percent < 80) {
                    css = 'orange';
                }
                else if (percent > 80 && percent < 100) {
                    css = 'blue';
                }
                else if (percent == 100) {
                    css = 'green';
                }
                else if (percent > 100) {
                    css = 'green';
                }
                return css;
            }
        }
    })();

    //self.Bootstrap = (function () {
    //    return {
    //        ApplyDropDownMenuFix: function (percent) {
    //            $(".table-advance").on("shown.bs.dropdown", function (e) {
    //                alert('');
    //                var $table = $(this),
    //                    $menu = $(e.target).find(".dropdown-menu"),
    //                    tableOffsetHeight = $table.offset().top + $table.height(),
    //                    menuOffsetHeight = $menu.offset().top + $menu.outerHeight(true);

    //                if (menuOffsetHeight > tableOffsetHeight)
    //                    $table.css("padding-bottom", menuOffsetHeight - tableOffsetHeight);
    //            });

    //            $(".table-advance").on('hide.bs.dropdown', function () {
    //                $(this).css("padding-bottom", 0);
    //            });
    //            return css;
    //        }
    //    }
    //})();
    
    return self;
}();

(function ($) {
    $.fn.mcollapse = function (options) {
        var delayDuration = 0;

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            shadowEffect: true,
            contentFocus: true,
            delay: 'walker'
        }, options);

        switch (settings.delay) {
            case "faster":
                delayDuration = 100;
                break;

            case "medium":
                delayDuration = 200;
                break;

            case "walker":
                delayDuration = 300;
                break;

            default:
                delayDuration = 300;
        }

        if (settings.shadowEffect === true) {
            this.find('.m-result').addClass('shadow-effect');
        }
        if (settings.contentFocus === true) {
            this.find('.m-result').addClass('content-focus');
        }

        var getPlugin = $('[data-collapse=m-collapse]');

        getPlugin.click(function (e) {
            var getTarget = $(this).data('target');
            var getResult = $(getTarget).parent();

            if (getResult.hasClass('active')) {
                $(getTarget + ':visible').slideUp(delayDuration);
                getResult.removeClass('active');
            } else {
                $(getTarget).not(':visible').slideDown(delayDuration);
                getResult.addClass('active');
            }

            e.preventDefault();
        });
        return this;
    };
}(jQuery));