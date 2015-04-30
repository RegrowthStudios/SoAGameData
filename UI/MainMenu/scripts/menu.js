// Resize scrollable panes to corret height.
function resizeScrollablePlanes() {
    if ($(".scrollable-pane.full-height").length > 0) {
        var h = $(window).height();
        var r = $("#menu-header").height();
        r += parseInt($("#outer-wrapper").css('marginTop'));
        r += $(".header").outerHeight(true);
        r += parseInt($("#options").css('marginTop'));
        r += 60; //Buffer at bottom.
        h -= r;
        $("#options").height(h);
    }
};

// Resize extra options to fit with left column.
function resizeExtraOptions() {
    var h2 = $("#options-extra").parent().height();
    $("#options-extra").height(h2);
};

// Handle sub-lists.
function handleSubLists() {
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
    $.each($(".sub-list-wrapper"), function (i, v) {
        //hide to prevent "flashing" of options menu.
        var elem = $(v).hide();
        //show momentarily to measure height (not displayed).
        elem.data("height", elem.show().height());
        elem.hide();
        toggleExpansionSubList(elem);
        $(elem).off().parent().on("click", function () {
            toggleExpansionSubList(elem);
        });
        //show once the animation dur has passed (allowing the options to be slid out of view).
        setTimeout(function () {
            elem.show();
        }, animationDur);
    });
    $(".sub-list-item").off().on("click", function (e) {
            e.stopPropagation();
        });
};

/***********************/
/* Dynamic Page Loader */
/***********************/

function loadNewPage(name, filePath) {
    App.setCurrentPage(name);
    var pageProperties = App.getPageProperties(); // Returns JavaScript Object of form: { CSS: [ "filepath1.css", "filepath2.css" ], JS: [ "filepath3.js", "filepath.js" ] }
    var filesToLoad = {};
    filesToLoad["CSS"] = pageProperties[0];
    filesToLoad["JS"] = pageProperties[1];
    var stringifiedFilesToLoad = JSON.stringify(filesToLoad);

    if (typeof filePath == "string") {
        window.location.assign(filePath + "?name=" + name + "&filesToLoad=" + stringifiedFilesToLoad);
    } else {
        window.location.assign("/index.html?name=" + name + "&filesToLoad=" + stringifiedFilesToLoad);
    }
}

//function loadNewPage(name, filePath) {
//    window.location.assign("/index.html?name=" + name + "&filesToLoad=" + filePath);
//}

// Load controls for page.
function initializePage(controls) {
    $.each(controls, function (i, v) {
        if ( v == "END" ) continue;
        App.print(v);
        switch (v[0]) {
            case "click":
                ListItemGenerator.generateClickable(v[1], v[2], v[3], v[4], v[5], v[6]);
                break;
            case "text":
                ListItemGenerator.generateText(v[1], v[2], v[3], v[4]);
                break;
            case "toggle":
                ListItemGenerator.generateToggle(v[1], v[2], v[3], v[4], v[5], v[6], v[7]);
                break;
            case "slider":
                ListItemGenerator.generateSlider(v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8], v[9], v[10]);
                break;
            case "discrete":
                ListItemGenerator.generateDiscreteSlider(v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8]);
                break;
            case "combo":
                ListItemGenerator.generateComboBox(v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8]);
                break;
        }
    });

    resizeScrollablePlanes();
    resizeExtraOptions();
    handleSubLists();
};

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
    },
    /**
     * Adds a description for a control to the DOM.
     * oid - The control ID of the control that the description should be attached to.
     * htmlControl - The HTML of the description to be added.
     */
    addDescription: function (oid, description) {
        if (typeof description == "string") {
            var htmlDescriptor = "<div class='helper' data-oid='" + oid + "'>" + description + "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div></div>"
            $(htmlDescriptor).appendTo("#options-helper-wrapper").hide();
            optDescs = $("#options-helper-wrapper > div");
            opts = $("#options .list-item, #options .sub-list-item");
            refreshDescControl();
        }
    },
    /**
     * Generates the HTML code for a clickable control (i.e. a link or otherwise button-like control).
     * name - Name of the control to be displayed to the user.
     * linkData - Path to the file the button should take the user to.
     * ID - C++ ID for the control.
     * updateCallback - The name of the function to be called when relaying the current state of the control.
     * isSubList - Boolean stating if control is in a sublist.
     */
    generateHTMLClickable: function (name, linkData, ID, updateCallback, isSubList) {
        var oid = name.replace(/ /g, "-");
        var htmlControl = "";
        if (typeof isSubList !== "undefined" && isSubList) {
            htmlControl += "<li class='sub-list-item clickable list-item row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item clickable row' data-oid='" + oid + "'>";
        }
        if (typeof ID !== "undefined" && typeof updateCallback !== "undefined") {
            htmlControl += "<a href='#' onclick='" + updateCallback + "(" + ID + ", \"" + oid + "\"); loadNewPage(" + linkData[0] + ", " + linkData[1] + ");'>";
        } else {
            htmlControl += "<a href='#'>";
        }
        htmlControl += name;
        htmlControl += "</a>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>";
        return htmlControl;
    },
    /**
     * Generates the HTML code for a static text element.
     * name - Name of the element to be displayed to the user.
     * text - Text to be displayed in the element.
     * isSubList - Boolean stating if control is in a sublist.
     */
    generateHTMLText: function (name, text, isSubList) {
        var oid = name.replace(/ /g, "-");
        var htmlControl = "";
        if (typeof isSubList !== "undefined" && isSubList) {
            htmlControl += "<li class='sub-list-item list-item row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item row' data-oid='" + oid + "'>";
        }
        htmlControl += "<div class='column-2'>" + name + "</div>";
        htmlControl += "<div class='content-center column-2'>" + text + "</div>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>";
        return htmlControl;
    },
    /**
     * Generates the HTML code for a toggleable control.
     * name - Name of the control to be displayed to the user.
     * initialVal - Initial value of the control.
     * ID - C++ ID for the control.
     * updateCallback - The name of the function to be called when relaying the current state of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     * isSubList - Boolean stating if control is in a sublist.
     */
    generateHTMLToggle: function (name, initialVal, ID, updateCallback, updateInRealTime, isSubList) {
        var oid = name.replace(/ /g, "-");
        var htmlControl = "";
        if (typeof isSubList !== "undefined" && isSubList) {
            htmlControl += "<li class='sub-list-item list-item row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item row' data-oid='" + oid + "'>";
        }
        htmlControl += "<div class='column-2'>" + name + "</div>";
        htmlControl += "<div class='content-center column-2'>";
        htmlControl += "<div class='checkbox'>";
        if (typeof ID !== "undefined" && typeof updateCallback !== "undefined") {
            if (typeof updateInRealTime !== "undefined" && updateInRealTime) {
                htmlControl += "<input id='" + oid + "' type='checkbox' name='" + oid + "' " + initialVal + " onchange='" + updateCallback + "(" + ID + ", value, \"" + oid + "\")'>";
            } else {
                htmlControl += "<input id='" + oid + "' type='checkbox' name='" + oid + "' " + initialVal + " onchange='controls[" + ID + "] = value;'>";
            }            
        } else {
            htmlControl += "<input id='" + oid + "' type='checkbox' name='" + oid + "' " + initialVal + ">";
        }
        htmlControl += "<label for='" + oid + "'></label>";
        htmlControl += "</div>";
        htmlControl += "</div>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>";
        return htmlControl;
    },
    /**
     * Generates the HTML code for a slideable control.
     * name - Name of the control to be displayed to the user.
     * min - The minimum value of the slider.
     * max - The maximum value of the slider.
     * initialVal - The initial value of the control. Takes a value between min and max.
     * intervalRes - The size of each interval in the slider.
     * ID - C++ ID for the control.
     * updateCallback - The name of the function to be called when relaying the current state of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     * isSubList - Boolean stating if control is in a sublist.
     */
    generateHTMLSlider: function (name, min, max, initialVal, intervalRes, ID, updateCallback, updateInRealTime, isSubList) {
        var oid = name.replace(/ /g, "-");
        var htmlControl = "";
        if (typeof isSubList !== "undefined" && isSubList) {
            htmlControl += "<li class='sub-list-item list-item row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item row' data-oid='" + oid + "'>";
        }
        htmlControl += "<div class='column-2'>" + name + "</div>";
        htmlControl += "<div class='content-center column-2'>";
        if (typeof ID !== "undefined" && typeof updateCallback !== "undefined") {
            if (typeof updateInRealTime !== "undefined" && updateInRealTime) {
                htmlControl += "<input type='range' min='" + min + "' max='" + max + "' value='" + ((initialVal >= min && initialVal <= max) ? initialVal : min) + "' id='" + oid + "' step='" + intervalRes + "' oninput='return " + updateCallback + "(" + ID + ", value, \"" + oid + "\");'>";
            } else {
                htmlControl += "<input type='range' min='" + min + "' max='" + max + "' value='" + ((initialVal >= min && initialVal <= max) ? initialVal : min) + "' id='" + oid + "' step='" + intervalRes + "' oninput='controls[" + ID + "] = value;'>";
            }
        } else {
            htmlControl += "<input type='range' min='" + min + "' max='" + max + "' value='" + ((initialVal >= min && initialVal <= max) ? initialVal : min) + "' id='" + oid + "' step='" + intervalRes + "'>";
        }
        htmlControl += "<output for='" + oid + "' id='" + oid + "-output'>" + initialVal + "</output>";
        htmlControl += "</div>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>";
        return htmlControl;
    },
    /**
     * Generates the HTML code for a discrete slider control.
     * name - Name of the control to be displayed to the user.
     * vals - Array of values to exist in the discrete slider.
     * initialVal - The initial value of the control. Takes a value from the array of values provided.
     * ID - C++ ID for the control.
     * updateCallback - The name of the function to be called when relaying the current state of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     * isSubList - Boolean stating if control is in a sublist.
     */
    generateHTMLDiscreteSlider: function (name, vals, initialVal, ID, updateCallback, updateInRealTime, isSubList) {
        var oid = name.replace(/ /g, "-");
        var htmlControl = "";
        if (typeof isSubList !== "undefined" && isSubList) {
            htmlControl += "<li class='sub-list-item list-item row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item row' data-oid='" + oid + "'>";
        }
        htmlControl += "<div class='column-2'>" + name + "</div>";
        htmlControl += "<div class='content-center column-2'>";
        htmlControl += "<div id='control-previous-" + oid + "' class='control-previous'><span>&lt;</span></div>";
        htmlControl += "<div id='control-discrete-slider-" + oid + "' class='control-discrete-slider'>";
        $.each(vals, function (i, v) {
            var vid = v.replace(/ /g, "-");
            htmlControl += "<div data-value='" + vid + "' style='display:none;'>" + v + "</div>";
        });
        htmlControl += "</div>";
        htmlControl += "<div id='control-next-" + oid + "' class='control-next'><span>&gt;</span></div>";
        htmlControl += "</div>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>";
        return htmlControl;
    },
    /**
     * Generates the HTML code for a text area control.
     * name - Name of the control to be displayed to the user.
     * defaultVal - Default text in the text area.
     * maxLength - Maximum length of the text inputted.
     * ID - C++ ID for the control.
     * isSubList - Boolean stating if control is in a sublist.
     */
    generateHTMLTextArea: function (name, defaultVal, maxLength, ID, isSubList) {
        var oid = name.replace(/ /g, "-");
        var htmlControl = "";
        if (typeof isSubList !== "undefined" && isSubList) {
            htmlControl += "<li class='sub-list-item list-item row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item row' data-oid='" + oid + "'>";
        }
        htmlControl += "<div class='column-2'>" + name + "</div>";
        htmlControl += "<div class='content-center column-2'>";
        if (typeof ID !== "undefined") {
            htmlControl += "<input type='text' maxlength='" + maxLength + "' placeholder='" + defaultVal + "' oninput='controls[" + ID + "] = value;'>"
        } else {
            htmlControl += "<input type='text' maxlength='" + maxLength + "' placeholder='" + defaultVal + "'>"
        }
        htmlControl += "</div>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>";
        return htmlControl;
    },
    /**
     * Generates the HTML code for a sublist.
     * name - Name of the control to be displayed to the user.
     * subItems - Array of objects detailing items to exist in the sublist.
     */
    generateHTMLSubList: function (name, subItems) {
        var lid = name.replace(/ /g, "-");
        var htmlControl = "<li class='list-item sub-list-owner row' data-oid='" + lid + "'>";
        htmlControl += name;
        htmlControl += "<div class='sub-list-wrapper'>"
        htmlControl += "<ul class='sub-list'>";
        $.each(subItems, function (i, v) {
            switch (v[0]) {
                case "click": // Make sure this matches generate clickable: name, linkData, description, ID, updateCallback
                    htmlControl += ListItemGenerator.generateHTMLClickable(v[1], v[2], v[4], v[5], true);
                    ListItemGenerator.addDescription(v[1].replace(/ /g, "-"), v[3]);
                    break;
                case "text": // Make sure this matches generate text: name, text, description
                    htmlControl += ListItemGenerator.generateHTMLText(v[1], v[2], true);
                    ListItemGenerator.addDescription(v[1].replace(/ /g, "-"), v[3]);
                    break;
                case "toggle": // Make sure this matches generate toggle: name, initialVal, description, ID, updateCallback, updateInRealTime
                    htmlControl += ListItemGenerator.generateHTMLToggle(v[1], v[2], v[4], v[5], v[6], true);
                    ListItemGenerator.addDescription(v[1].replace(/ /g, "-"), v[3]);
                    break;
                case "slider": // Make sure this matches generate slider: name, min, max, initialVal, intervalRes, description, ID, updateCallback, updateInRealTime
                    htmlControl += ListItemGenerator.generateHTMLSlider(v[1], v[2], v[3], v[4], v[5], v[7], v[8], v[9], true);
                    ListItemGenerator.addDescription(v[1].replace(/ /g, "-"), v[6]);
                    break;
                case "discrete": // Make sure this matches generate discrete: name, vals, initialVal, description, ID, updateCallback, updateInRealTime
                    htmlControl += ListItemGenerator.generateHTMLDiscreteSlider(v[1], v[2], v[3], v[5], v[6], v[7], true);
                    ListItemGenerator.addDescription(v[1].replace(/ /g, "-"), v[4]);
                    break;
                case "combo": // Make sure this matches generate combo box: name, vals, initialVal, description, ID, updateCallback, updateInRealTime
                    htmlControl += ListItemGenerator.generateHTMLComboBox(v[1], v[2], v[3], v[5], v[6], v[7], true);
                    ListItemGenerator.addDescription(v[1].replace(/ /g, "-"), v[4]);
                    break;
            }
        });
        htmlControl += "</ul>"
        htmlControl += "</div>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>"
        return htmlControl;
    },
    /**
     * Generates the HTML code for a combo box control.
     * name - Name of the control to be displayed to the user.
     * vals - Array of values to exist in the combo box.
     * initialVal - The initial value of the control. Takes a value from the array of values provided.
     * ID - C++ ID for the control.
     * updateCallback - The name of the function to be called when relaying the current state of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     * isSubList - Boolean stating if control is in a sublist.
     */
    generateHTMLComboBox: function (name, vals, initialVal, ID, updateCallback, updateInRealTime, isSubList) {
        var oid = name.replace(/ /g, "-");
        var htmlControl = "";
        if (typeof isSubList !== "undefined" && isSubList) {
            htmlControl += "<li class='sub-list-item list-item row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item row' data-oid='" + oid + "'>";
        }
        htmlControl += "<div class='column-2'>" + name + "</div>";
        htmlControl += "<div class='content-center column-2'>";
        htmlControl += "<select class='combo'>";
        $.each(vals, function (i, v) {
            var vid = v.replace(/ /g, "-");
            if (v == initialVal) {

            } else {
                htmlControl += "<option data-value='" + vid + "'>" + v + "</option>";
            }
        });
        htmlControl += "</select>";
        htmlControl += "</div>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>";
        return htmlControl;
    },


    /**
     * Creates a category for the options menu.
     * name - Name of the category to be displayed to the user.
     */
    createCategory: function (name) {
        var cid = name.replace(/ /g, "-");
        var htmlCategory = "<li class='list-header' data-category='" + cid + "'>" + name + "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div></li>";
        $("#options").append(htmlCategory);
    },
    /**
     * Generates a clickable control (i.e. a link or otherwise button-like control).
     * name - Name of the control to be displayed to the user.
     * linkData - Array of name of file and path to the file the button should take the user to.
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     * ID - C++ ID for the control.
     * updateCallback - The name of the function to be called upon a change of state to the control.
     * resizeUI - Boolean defaulting to true, if true resize UI functions are called.
     */
    generateClickable: function (name, linkData, category, description, ID, updateCallback, resizeUI) {
        var oid = name.replace(/ /g, "-");
        var cid = category.replace(/ /g, "-");
		this.placeControl(cid, this.generateHTMLClickable(name, linkData, ID, updateCallback));
		this.addDescription(oid, description);
		if (typeof resizeUI === "undefined" || resizeUI) {
		    resizeScrollablePlanes();
		    resizeExtraOptions();
		    handleSubLists();
		}
    },
    /**
     * Generates a static text element.
     * name - Name of the control to be displayed to the user.
     * text - Text to be displayed in the element.
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     * resizeUI - Boolean defaulting to true, if true resize UI functions are called.
     */
    generateText: function (name, text, category, description, resizeUI) {
        var oid = name.replace(/ /g, "-");
        var cid = category.replace(/ /g, "-");
        placeControl(cid, this.generateHTMLText(name, text));
        this.addDescription(oid, description);
        if (typeof resizeUI === "undefined" || resizeUI) {
            resizeScrollablePlanes();
            resizeExtraOptions();
            handleSubLists();
        }
    },
    /**
     * Generates a toggle control.
     * name - Name of the control to be displayed to the user.
     * initialVal - The initial value of the control. Takes either an empty string or "checked".
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     * ID - C++ ID for the control.
     * updateCallback - The callback function to be called on user update of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     * resizeUI - Boolean defaulting to true, if true resize UI functions are called.
     */
    generateToggle: function (name, initialVal, category, description, ID, updateCallback, updateInRealTime, resizeUI) {
        if (typeof updateInRealTime !== "undefined" && !updateInRealTime) {
            controls[ID] = initialVal;
        }
        var oid = name.replace(/ /g, "-");
        var cid = category.replace(/ /g, "-");
        this.placeControl(cid, this.generateHTMLToggle(name, initialVal, ID, updateCallback, updateInRealTime));
        this.addDescription(oid, description);
        if (typeof resizeUI === "undefined" || resizeUI) {
            resizeScrollablePlanes();
            resizeExtraOptions();
            handleSubLists();
        }
    },
    /**
     * Generates a slider control.
     * name - Name of the control to be displayed to the user.
     * min - The minimum value of the slider.
     * max - The maximum value of the slider.
     * initialVal - The initial value of the control. Takes a value between min and max.
     * intervalRes - The size of each interval in the slider.
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     * ID - C++ ID for the control.
     * updateCallback - The callback function to be called on user update of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     * resizeUI - Boolean defaulting to true, if true resize UI functions are called.
     */
    generateSlider: function (name, min, max, initialVal, intervalRes, category, description, ID, updateCallback, updateInRealTime, resizeUI) {
        if (typeof updateInRealTime !== "undefined" && !updateInRealTime) {
            controls[ID] = initialVal;
        }
        var oid = name.replace(/ /g, "-");
        var cid = category.replace(/ /g, "-");
        this.placeControl(cid, this.generateHTMLSlider(name, min, max, initialVal, intervalRes, ID, updateCallback, updateInRealTime));
        this.addDescription(oid, description);
        if (typeof resizeUI === "undefined" || resizeUI) {
            resizeScrollablePlanes();
            resizeExtraOptions();
            handleSubLists();
        }
    },
    /**
     * Generates a discrete slider control.
     * name - Name of the control to be displayed to the user.
     * vals - Array of values to exist in the discrete slider.
     * initialVal - The initial value of the control. Takes a value from the array of values provided.
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     * ID - C++ ID for the control.
     * updateCallback - The callback function to be called on user update of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     * resizeUI - Boolean defaulting to true, if true resize UI functions are called.
     */
    generateDiscreteSlider: function (name, vals, initialVal, category, description, ID, updateCallback, updateInRealTime, resizeUI) {
        if (typeof updateInRealTime !== "undefined" && !updateInRealTime) {
            controls[ID] = initialVal;
        }
        var oid = name.replace(/ /g, "-");
        var cid = category.replace(/ /g, "-");
        this.placeControl(cid, this.generateHTMLDiscreteSlider(name, vals, initialVal, ID, updateCallback, updateInRealTime));
        this.addDescription(oid, description);
        if (typeof resizeUI === "undefined" || resizeUI) {
            resizeScrollablePlanes();
            resizeExtraOptions();
            handleSubLists();
        }
        var initialVid = initialVal.replace(/ /g, "-");
        var elements = new Array();
        var startIndex = 0;
        $.each($("#control-discrete-slider-" + oid + " > div"), function (i, v) {
            elements[i] = $(v);
            if ($(v).data("value") == initialVid) {
                startIndex = i;
            }
        });
        discreteSliders[ID] = new DiscreteSlider({ next: $("#control-next-" + oid + " > span"), previous: $("#control-previous-" + oid + " > span") }, elements, $("#control-discrete-slider-" + oid), startIndex);
    },
    /**
     * Generates a text area control.
     * name - Name of the control to be displayed to the user.
     * defaultVal - Default text in the text area.
     * maxLength - Maximum length of the text inputted.
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     * ID - C++ ID for the control.
     * resizeUI - Boolean defaulting to true, if true resize UI functions are called.
     */
    generateTextArea: function (name, defaultVal, maxLength, category, description, ID, resizeUI) {
        controls[ID] = "";
        var oid = name.replace(/ /g, "-");
        var cid = category.replace(/ /g, "-");
        this.placeControl(cid, this.generateHTMLTextArea(name, defaultVal, maxLength, ID));
        this.addDescription(oid, description);
        if (typeof resizeUI === "undefined" || resizeUI) {
            resizeScrollablePlanes();
            resizeExtraOptions();
            handleSubLists();
        }
    },
    /**
     * Generates a sublist.
     * name - Name of the control to be displayed to the user.
     * subItems - Array of objects detailing items to exist in the sublist.
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     * resizeUI - Boolean defaulting to true, if true resize UI functions are called.
     */
    generateSubList: function (name, subItems, category, description, resizeUI) {
        var lid = name.replace(/ /g, "-");
        var cid = category.replace(/ /g, "-");
        this.placeControl(cid, this.generateHTMLSubList(name, subItems));
        this.addDescription(lid, description);
        if (typeof resizeUI === "undefined" || resizeUI) {
            resizeScrollablePlanes();
            resizeExtraOptions();
            handleSubLists();
        }
    },
    /**
     * Generates a combo box.
     * name - Name of the control to be displayed to the user.
     * vals - Array of values to exist in the combo box.
     * initialVal - The initial value of the control. Takes a value from the array of values provided.
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     * ID - C++ ID for the control.
     * updateCallback - The callback function to be called on user update of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     * resizeUI - Boolean defaulting to true, if true resize UI functions are called.
     */
    generateComboBox: function (name, vals, initialVal, category, description, ID, updateCallback, updateInRealTime, resizeUI) {
        if (typeof updateInRealTime !== "undefined" && !updateInRealTime) {
            controls[ID] = initialVal;
        }
        var oid = name.replace(/ /g, "-");
        var cid = category.replace(/ /g, "-");
        this.placeControl(cid, this.generateHTMLComboBox(name, vals, initialVal, ID, updateCallback, updateInRealTime));
        this.addDescription(oid, description);
        if (typeof resizeUI === "undefined" || resizeUI) {
            resizeScrollablePlanes();
            resizeExtraOptions();
            handleSubLists();
        }
    }
}
