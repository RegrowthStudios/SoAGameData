// Resize scrollable panes to corret height.
$(document).ready(function () {
    if ($(".scrollable-pane.full-height").length > 0) {
        setTimeout(function () {
            var h = $(window).height();
            var r = $("#menu-header").height();
            r += parseInt($("#outer-wrapper").css('marginTop'));
            r += $(".header").outerHeight(true);
            r += parseInt($("#options").css('marginTop'));
            r += 60; //Buffer at bottom.
            h -= r;
            $("#options").height(h);
        }, 10);
    }
});

// Resize extra options to fit with left column.
$(document).ready(function () {
    setTimeout(function () {
        var h2 = $("#options-extra").parent().height();
        $("#options-extra").height(h2);
    }, 20);
});

// Handle sub-lists.
$(document).ready(function () {
    var animationDur = 300;
    function toggleExpansionSubList(elem) {
        if (elem.hasClass("contracted")) {
            var h = elem.data("height");
            elem.animate({
                height: h
            }, animationDur, function () {
                elem.removeClass("contracted");
                elem.addClass("expanded");
            });
            var opts = $("#options");
            opts.animate({
                scrollTop: opts.scrollTop() + h
            }, animationDur);
        } else {
            elem.animate({
                height: 0
            }, animationDur, function () {
                elem.height(0);
                elem.removeClass("expanded");
                elem.addClass("contracted");
            });
        }
    }

    setTimeout(function () {
        $.each($(".sub-list-wrapper"), function (i, v) {
            //hide to prevent "flashing" of options menu.
            var elem = $(v).hide();
            //show momentarily to measure height (not displayed).
            elem.data("height", elem.show().height());
            elem.hide();
            toggleExpansionSubList(elem);
            $(elem).parent().on("click", function () {
                toggleExpansionSubList(elem);
            });
            //show once the animation dur has passed (allowing the options to be slid out of view).
            setTimeout(function () {
                elem.show();
            }, animationDur);
        });
        $(".sub-list-item").on("click", function (e) {
            e.stopPropagation();
        });
    }, 10);
});

/***********************/
/* Dynamic Page Loader */
/***********************/

//function loadNewPage(name, filePath) {
//    App.setCurrentPage(name);
//    var pageProperties = App.getPageProperties(); // Returns JavaScript Object of form: { CSS: [ "filepath1.css", "filepath2.css" ], JS: [ "filepath3.js", "filepath.js" ] }
//    var filesToLoad = {};
//    filesToLoad["CSS"] = pageProperties["CSS"];
//    filesToLoad["JS"] = pageProperties["JS"];
//    var stringifiedFilesToLoad = JSON.stringify(filesToLoad);

//    if (typeof filePath == "string") {
//        window.location.assign(filePath + "?name=" + name + "&filesToLoad=" + stringifiedFilesToLoad);
//    } else {
//        window.location.assign("/index.html?name=" + name + "&filesToLoad=" + stringifiedFilesToLoad);
//    }
//}

//function loadNewPage(name, filePath) {
//    window.location.assign("/index.html?name=" + name + "&filesToLoad=" + filePath);
//}

// Load controls for page.
//$(document).ready(function () {
//    var lig = new ListItemGenerator();
//    var controls = App.getControls(); // Latest page passed in on loadNewPage();
//    //var controls = [ { function: "lig.generateClickable(args);", args: { name: "New Game", linkData: { name: "New Game" }, category: "", ID: 0, description: "Start a new game!" } }, { function: "lig.generateClickable(args);", args: { name: "Load Game", linkData: { name: "Load Game" }, category: "", ID: 1, description: "Load an old game!" } } ];
//    // [ { function: "generateClickable(args);", args: { name: "New Game", linkData: { name: "New Game" }, category: "", ID: 0, description: "Start a new game!" } }, { function: "generateClickable(args);", args: { name: "Load Game", linkData: { name: "Load Game" }, category: "", ID: 1, description: "Load an old game!" } } ]
//    //$.each(controls, function (i, v) {
//    //    switch (v["type"]) {
//    //        case "click":
//    //            lig.generateClickable(v["name"], v["linkData"], v["category"], v["description"], v["ID"], v["updateCallback"]);
//    //            break;
//    //        case "text":
//    //            lig.generateText(v["name"], v["text"], v["category"], v["description"]);
//    //            break;
//    //        case "toggle":
//    //            lig.generateToggle(v["name"], v["initialValue"], v["category"], v["description"], v["ID"], v["updateCallback"], v["updateInRealTime"]);
//    //            break;
//    //        case "slider":
//    //            lig.generateSlider(v["name"], v["min"], v["max"], v["initialVal"], v["intervalRes"], v["category"], v["description"], v["ID"], v["updateCallback"], v["updateInRealTime"]);
//    //            break;
//    //        case "combo":
//    //            lig.generateDiscreteSlider(v["name"], v["vals"], v["initialVal"], v["category"], v["description"], v["ID"], v["updateCallback"], v["updateInRealTime"])
//    //            break;
//    //    }
//    //});
//    $.each(controls, function (i, v) {
//        var func = new Function(v["function"]);
//        func(v["args"]);
//    });
//});

/*******************/
/* Discrete Slider */
/*******************/

function DiscreteSlider(controls, elements, sliderFrame, startIndex, animationDuration, autoplayOptions) {
    var elements = typeof elements !== "undefined" ? elements : null;
    var index = typeof startIndex !== "undefined" ? startIndex : 0;
    var element = elements[index];
    $(element).show(); // Ensure the starting element is already visible.
    var animationDuration = typeof animationDuration !== "undefined" ? animationDuration : 200;
    var controlsLocked = false;
    var slideShowDelay, slideShowPauseDelay, slideShowPaused, ignoreMouseOut, automateID, automateSlideshow;
    var _this = this;

    if (typeof autoplayOptions !== "undefined") {
        slideShowDelay = typeof autoplayOptions["slideShowDelay"] !== "undefined" ? autoplayOptions["slideShowDelay"] : 6000;
        slideShowPauseDelay = typeof autoplayOptions["slideShowPauseDelay"] !== "undefined" ? autoplayOptions["slideShowPauseDelay"] : 7000;
        slideShowPaused = true;
        ignoreMouseOut = false;
        automateID = new Array();
        automateSlideshow = function () {
            if (slideShowPaused == false) {
                _this.nextItem();
                _this.clearTimeouts();
            }
            automateID[automateID.length] = setTimeout(function () {
                _this.automateSlideshow();
            }, slideShowDelay);
        }
        _this.playSlideshow = function () {
            if (!ignoreMouseOut && (elements.length > 1)) {
                _this.clearTimeouts();
                slideShowPaused = false;
                automateID[automateID.length] = setTimeout(function () {
                    _this.automateSlideshow();
                }, slideShowDelay);
            }
        }
        _this.pauseSlideshow = function () {
            slideShowPaused = true;
        }
        _this.pauseSlideshowDelay = function () {
            slideShowPaused = true;
            ignoreMouseOut = true;
            setTimeout(function () {
                ignoreMouseOut = false;
                _this.playSlideshow();
            }, slideShowPauseDelay);
        }
    }

    function clearTimeouts () {
        while (automateID.length > 0) {
            clearTimeout(automateID[0]);
            automateID.splice(0, 1);
        }
    };

    _this.nextItem = function () {
        if (elements.length > 1) {
            _this.lockControls();
            if (index != (elements.length - 1)) {
                var nextElement = $(elements[index + 1]);
                nextElement.prop("right", "-100%");
                $(element).hide("slide", { direction: "left", easing: "easeInOutCirc" }, animationDuration);
                nextElement.show("slide", { direction: "right", easing: "easeInOutCirc" }, animationDuration, function () {
                    _this.unlockControls();
                });
                element = nextElement;
                index++;
            } else {
                var nextElement = $(elements[0]);
                nextElement.prop("right", "-100%");
                $(element).hide("slide", { direction: "left", easing: "easeInOutCirc" }, animationDuration);
                nextElement.show("slide", { direction: "right", easing: "easeInOutCirc" }, animationDuration, function () {
                    _this.unlockControls();
                });
                element = nextElement;
                index = 0;
            }
        }
    }
    _this.previousItem = function () {
        if (elements.length > 1) {
            _this.lockControls();
            if (index != 0) {
                var nextElement = $(elements[index - 1]);
                nextElement.prop("left", "-100%");
                $(element).hide("slide", { direction: "right", easing: "easeInOutCirc" }, animationDuration);
                nextElement.show("slide", { direction: "left", easing: "easeInOutCirc" }, animationDuration, function () {
                    _this.unlockControls();
                });
                element = nextElement;
                index--;
            } else {
                var nextElement = $(elements[(elements.length - 1)]);
                nextElement.prop("left", "-100%");
                $(element).hide("slide", { direction: "right", easing: "easeInOutCirc" }, animationDuration);
                nextElement.show("slide", { direction: "left", easing: "easeInOutCirc" }, animationDuration, function () {
                    _this.unlockControls();
                });
                element = nextElement;
                index = (elements.length - 1);
            }
        }
    }
    _this.setItem = function (targetIndex, scrollTo) {
        if (targetIndex < 0 || targetIndex > elements.length) {
            return -1;
        }
        if (typeof autoplayOptions !== "undefined") {
            _this.pauseSlideshowDelay();
        }
        _this.lockControls();
        var nextElement = $(elements[targetIndex]);
        nextElement.prop("left", "-100%");
        $(element).hide("slide", { direction: "left", easing: "easeInOutCirc" }, animationDuration);
        nextElement.show("slide", { direction: "right", easing: "easeInOutCirc" }, animationDuration, function () {
            _this.unlockControls();
        });
        if (typeof scrollTo !== "undefined") {
            $('html, body').animate({
                scrollTop: scrollTo.offset().top - 200
            }, 1000);
        }
        element = nextElement;
        index = targetIndex;
    }
    _this.lockControls = function () {
        controlsLocked = true;
    }
    _this.unlockControls = function () {
        controlsLocked = false;
    }
    _this.lockControlsTemp = function (duration) {
        if (typeof duration !== "number") {
            return -1;
        }
        controlsLocked = true;
        setTimeout(function () {
            controlsLocked = false;
        }, duration);
    };
    _this.updateElementsList = function (newElements, replace) {
        if (typeof newElements == "undefined" && !(newElements[0] instanceof jQuery)) {
            return -1;
        }
        var replace = typeof replace !== "undefined" ? replace : false;
        if (replace) {
            elements = newElements;
            if (elements.length < 2) {
                if (controls.previous instanceof jQuery) {
                    controls.previous.fadeOut();
                }
                if (controls.next instanceof jQuery) {
                    controls.next.fadeOut();
                }
            }
        } else {
            elements = elements.concat(newElements);
            if (elements.length < 2) {
                if (controls.previous instanceof jQuery) {
                    controls.previous.fadeOut();
                }
                if (controls.next instanceof jQuery) {
                    controls.next.fadeOut();
                }
            }
        }
        $.each(newElements, function (i, v) {
            $(v).hover(function () {
                _this.pauseSlideshow();
            }, function () {
                _this.playSlideshow();
            });
        });
    }

    if (typeof autoplayOptions !== "undefined" && sliderFrame instanceof jQuery) {
        sliderFrame.hover(function () {
            _this.pauseSlideshow();
        }, function () {
            _this.playSlideshow();
        });
    }
    if (controls.next instanceof jQuery) {
        controls.next.click(function () {
            if (!controlsLocked) {
                if (typeof autoplayOptions !== "undefined") {
                    _this.pauseSlideshowDelay();
                }
                _this.nextItem();
            }
        });
    }
    if (controls.previous instanceof jQuery) {
        controls.previous.click(function () {
            if (!controlsLocked) {
                if (typeof autoplayOptions !== "undefined") {
                    _this.pauseSlideshowDelay();
                }
                _this.previousItem();
            }
        });
    }

    if (elements.length < 2) {
        if (controls.previous instanceof jQuery) {
            controls.previous.fadeOut();
        }
        if (controls.next instanceof jQuery) {
            controls.next.fadeOut();
        }
    }
}

/**************/
/* List Items */
/**************/

var opts;
var optDescs;
// Handle item descriptions.
function refreshDescControl() {
    opts.off('mouseover mouseout');
    opts.on('mouseover', function (e) {
        if ($(e.currentTarget).hasClass("sub-list-item")) {
            e.stopPropagation();
        }
        var midId = $(this).data("oid");
        for (var x = 0; x < opts.length; ++x) {
            if ($(optDescs[x]).data("oid") == midId) {
                $(optDescs[x]).show(0);
            } else {
                $(optDescs[x]).stop(false, true);
            }
        }
    })
    opts.on('mouseout', function (e) {
        if ($(e.currentTarget).hasClass("sub-list-item")) {
            e.stopPropagation();
        }
        var midId = $(this).data("oid");
        for (var x = 0; x < opts.length; ++x) {
            if ($(optDescs[x]).data("oid") == midId) {
                $(optDescs[x]).hide(0);
            } else {
                $(optDescs[x]).stop(false, true);
            }
        }
    });
}

var controls = [];
var discreteSliders = [];
// JS "Class" function that facilitates the creation of list items - largely controls, but also static elements.
var ListItemGenerator = {


    /**
     * Adds a control to the DOM.
     * cid - The category ID of the category that the control should be added to.
     * htmlControl - The HTML of the control to be added.
     */
    placeControl: function (cid, htmlControl) {
        var cat = $(".list-header[data-category=" + cid + "]");
        if (cat.length == 0) {
            $("#options").append(htmlControl);
        } else {
            var elems = cat.nextUntil(".list-header");
            if (elems.length == 0) {
                cat.after(htmlControl);
            } else {
                elems.last().after(htmlControl);
            }
        }
    }
    
}
