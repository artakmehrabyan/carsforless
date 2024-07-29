var App = function () {
    var self = this;
    self.IsMobile = false;
    self.InitContactPage = function () {
        $("#tab-toggle li a").click(function () {
            if ($(this).closest("li").hasClass("current-item")) {
                // same icon
                return false;
            }
            else {
                var visible_content = $(this).closest("li").attr("id");
                var hidden_content = $("#tab-toggle li.current-item").attr("id");
                $("#tab-toggle li").removeClass("current-item");
                $(this).closest("li").addClass("current-item");
                $("." + hidden_content).hide();
                $("." + visible_content).fadeIn("fast");

                if (visible_content == "directions") {
                    //initializeMaps("dealer");
                }
            }
            return false;
        });
    }

    self.Index = (function () {
        return {
            InitBestOffer: function () {
                $(document).ready(function () {
                    if (App.IsMobile) {
                        var slider = new MasterSlider();
                        slider.setup("masterslider", {
                            width: 1024,
                            height: 580,
                            //space:100,
                            fullwidth: true,
                            centerControls: false,
                            speed: 18,
                            view: "flow"
                        });
                        //slider.control('arrows');
                        slider.control("bullets", { autohide: false });
                    } else {
                        $('#slides').flexslider({
                            animation: "slide",
                            controlNav: false,
                            slideshow: false
                        });

                        $('.post-image-slides').flexslider({
                            animation: "slide",
                            controlNav: false,
                            slideshow: false
                        });
                        setTimeout(function () {
                            $(".flex-active-slide img").each(function () {
                                UI.Animation.AnimationHover(this, 'pulse');
                            });
                        }, 500);

                    }

                });


            },
            InitLatestOffer: function () {
                $.fn.carouFredSel.defaults.items.visible = 1;
                jQuery(".latest-offers .offer-list").carouFredSel({
                    circular: true,
                    height: 517,
                    direction: "vertical",
                    infinite: true,
                    align: false,
                    auto: false,
                    scroll: {
                        items: 'page'
                    },
                    next: {
                        button: ".scroll-down"
                        //key		: 'down'
                    },
                    prev: {
                        button: ".scroll-up"
                        //key		: 'up'
                    }
                });
                $(".list-content > ul, .offer-small").on("mouseenter mouseleave", "li a", function (e) {
                    if (e.type === "mouseenter") {
                        $(this).children(".entry-overlay").fadeIn(300);
                    } else {
                        $(this).children(".entry-overlay").fadeOut(300);
                    }
                });
                setTimeout(function () {
                    $(".offer-list li").each(function () {
                        UI.Animation.AnimationHover(this, 'pulse');
                    });
                }, 500);

            }
        };
    })();

    self.Details = (function () {
        return {
            InitMedia: function (showArrows, showThumblist, showLightbox) {
                $(document).ready(function () {

                    var slider = new MasterSlider();


                    if (App.IsMobile) {
                        slider.setup("masterslider", {
                            view: 'box',
                            autoHeight: true,
                            autoWidth: true,
                            space: 1
                        });
                        slider.control("arrows");
                        //slider.control("bullets", { autohide: false, align: "bottom", margin: 1 });
                        slider.control("scrollbar", { dir: "h", color: "#333" });

                    } else {
                        slider.setup("masterslider", {
                            //width: 480,
                            //height: 290,
                            width: 542,
                            height: 407,
                            space: 1,
                            loop: true,
                            view: "slide",
                            centerControls: false,
                            inView: 50,
                        });
                        if (showArrows) {
                            slider.control('arrows');
                        }
                        if (showLightbox) {
                            slider.control('lightbox');
                        }
                        if (showThumblist) {
                            slider.control('thumblist', {
                                autohide: false,
                                dir: 'h',
                                align: 'bottom',
                                height: 85,
                                margin: 5,
                                space: 5,
                                hideUnder: 400
                            });
                        }
                        setTimeout(function () {
                            $("a[rel^='prettyPhoto']").prettyPhoto({
                                autoplay: true,
                                autoplay_slideshow: false
                            });
                            $(".master-slider img").each(function () {
                                UI.Animation.AnimationHover(this, "pulse");
                            });
                        }, 500);
                    }
                });
            }
        }

    })();
    self.Cars = (function () {
        return {
            Init: function () {
                //$(".view-select-tabs a").click(function () {
                //    var new_view = $(this).attr("id");
                //    if ($(".list-content").hasClass(new_view)) {
                //        // Same icon
                //        return false;
                //    }
                //    else {
                //        var car_item = [];
                //        $(".list-content > ul > li:not(.dealer-tooltip)").each(function () {
                //            car_item.push({
                //                link: $(this).find(".item-link").attr("href"),
                //                image: $(this).find("img").attr("src"),
                //                title: $(this).find(".car-title").html(),
                //                price: $(this).find(".price-tag").html(),
                //                list_items: $(this).find(".item-specs").html(),
                //                verified: $(this).find(".v-sign").html(),
                //                dealer_name: $(this).find(".dealer-data").html()
                //            });
                //        });
                //        var view_html = "";
                //        if (new_view == "grid-view") {
                //            // Convert list-view to grid-view
                //            $("#list-view").removeClass("current");
                //            $("#grid-view").addClass("current");
                //            $(".list-content").removeClass("list-view");
                //            $(".list-content").addClass("grid-view");
                //            $(".list-content > ul").removeClass("detail-list");
                //            $(".list-content > ul").addClass("offer-small");
                //            $(car_item).each(function (k, data) {
                //                view_html += "<li><a href='" + data["link"] + "' class='item-link'>";
                //                view_html += "<img src='" + data["image"] + "' alt='" + data["title"] + "' />";
                //                view_html += "<div class='entry-label'>";
                //                view_html += "<h4 class='car-title'>" + data["title"] + "</h4>";
                //                view_html += "<span class='price-tag'>" + data["price"] + "</span>";
                //                view_html += "</div>";
                //                view_html += "<div class='entry-overlay'>";
                //                view_html += "<ul class='item-specs'>" + data["list_items"] + "</ul>";
                //                view_html += "</div>";
                //                data["verified"] == "V" ? view_html += "<span class='v-sign'>V</span><span class='dealer-data'>" + data["dealer_name"] + "</span>" : "";
                //                view_html += "</a></li>";
                //            });

                //        }
                //        else {
                //            // Convert grid-view to list-view
                //            $("#grid-view").removeClass("current");
                //            $("#list-view").addClass("current");
                //            $(".list-content").addClass("list-view");
                //            $(".list-content").removeClass("grid-view");
                //            $(".list-content > ul").removeClass("offer-small");
                //            $(".list-content > ul").addClass("detail-list");
                //            $(car_item).each(function (k, data) {
                //                view_html += "<li><a href='" + data["link"] + "' class='item-link'>";
                //                view_html += "<span class='overlay'>Overlay</span>";
                //                view_html += "<img src='" + data["image"] + "' alt='" + data["title"] + "'/>";
                //                data["verified"] == "V" ? view_html += "<span class='v-sign'>V</span><span class='dealer-data'>" + data["dealer_name"] + "</span>" : "";
                //                view_html += "</a>";
                //                view_html += "<div class='text-content'>";
                //                view_html += "<div class='layer-one'>";
                //                view_html += "<h3><a href='" + data["link"] + "' class='car-title'>" + data["title"] + "</a></h3>";
                //                view_html += "<span class='price-tag'>" + data["price"] + "</span>";
                //                view_html += "</div>";
                //                view_html += "<ul class='item-specs layer-two'>" + data["list_items"] + "</ul>";
                //                view_html += "<div class='layer-three'>";
                //                view_html += "<a href='" + data["link"] + "' class='details-link'>View details</a>";
                //                view_html += "</div>";
                //                view_html += "</div>";
                //                view_html += "</li>";
                //            });
                //        }
                //        view_html += "<li class='dealer-tooltip'><div><a href='#'>Dealer Name</a></div></li>";
                //        $(".list-content > ul").hide();
                //        $(".list-content > ul").html("");
                //        $(".list-content > ul").html(view_html);
                //        $(".list-content > ul").fadeIn("fast");
                //    }
                //    return false;
                //});
                setTimeout(function () {
                    //$(".item-link").each(function () {
                    //    UI.Animation.AnimationHover(this, 'pulse');
                    //});
                }, 500);
            },

            SetListView: function () {
                setTimeout(function () {
                    $("#list-view").click();
                }, 1);
            }
        }

    })();

    self.Accordion = (function () {
        return {
            Init: function () {
                $(".accordion > dd").hide();
                $(".accordion > dd").first().show();
                $(".accordion > dt > a").first().addClass("active");

                $(document).on("click", ".accordion > dt > a", function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    $(this).closest(".accordion").find("dd").slideUp(800, "easeInOutExpo");

                    $(this).closest(".accordion").find("a").removeClass("active");

                    if ($(this).parent().next().css("display") !== "block") {
                        $(this).parent().next().slideDown();
                        $(this).addClass("active");
                        return false;
                    }

                    return false;

                });
            }
        }

    })();
    return self;
}();