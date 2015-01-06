// Handles overlays
$(document).ready(function () {
    $(".pop-overlay").click(function (e) {
        $(".overlay[data-overlay-id='" + $(e.currentTarget).data("overlay-id") + "']").fadeIn(100);
    });
    $(".close").click(function () {
        $(".overlay").fadeOut(100);
    });
});

//// Handles menu item hover
//$(document).ready(function () {
//    $(".menu-item").mouseenter(function () {
//        $(this).children(".hover")[0].play();
//    });
//});

//// Handles sub menu expand/contract
//$(document).ready(function () {
//    $(".menu-item-expandable").click(function () {
//        if ($(this).hasClass("expanded")) {
//            $(this).children(".contract")[0].play();
//        } else {
//            $(this).children(".expand")[0].play();
//        }
//        $(this).toggleClass("expanded");
//    });
//});

var opts;
var optDescs;
// Handle item descriptions.
function refreshDescControl() {
    opts.off('mouseover mouseout');
    opts.on('mouseover', function () {
        var midId = $(this).data("oid");
        for (var x = 0; x < opts.length; ++x) {
            if ($(optDescs[x]).data("oid") == midId) {
                $(optDescs[x]).show(0);
            } else {
                $(optDescs[x]).stop(false, true);
            }
        }
    })
    opts.on('mouseout', function () {
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

//Resize scrollable panes to corret height.
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

/**************/
/* List Items */
/**************/

var controls = [];
// JS "Class" function that facilitates the creation of list items - largely controls, but also static elements.
function ListItemGenerator() {


    /**
     * Adds a control to the DOM.
     * cid - The category ID of the category that the control should be added to.
     * htmlControl - The HTML of the control to be added.
     */
    function placeControl(cid, htmlControl) {
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
    /**
     * Adds a description for a control to the DOM.
     * oid - The control ID of the control that the description should be attached to.
     * htmlControl - The HTML of the description to be added.
     */
    function addDescription(oid, description) {
        if (typeof description == "string") {
            var htmlDescriptor = "<div class='helper' data-oid='" + oid + "'>" + description + "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div></div>"
            $(htmlDescriptor).appendTo("#options-helper-wrapper").hide();
            optDescs = $("#options-helper-wrapper > div");
            opts = $("#options > .list-item");
            refreshDescControl();
        }
    }
    /**
     * Generates the HTML code for a clickable control (i.e. a link or otherwise button-like control).
     * name - Name of the control to be displayed to the user.
     * link - Path to the file the button should take the user to.
     * ID - C++ ID for the control.
     * updateCallback - The name of the function to be called when relaying the current state of the control.
     * isSubList - Boolean stating if control is in a sublist.
     */
    function generateHTMLClickable(name, link, ID, updateCallback, isSubList) {
        var oid = name.replace(" ", "-");
        var htmlControl = "";
        if (typeof isSubList != undefined && isSubList) {
            htmlControl += "<li class='sub-list-item clickable row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item clickable row' data-oid='" + oid + "'>";
        }
        if (typeof ID != undefined && typeof updateCallback != undefined) {
            htmlControl += "<a href='" + link + "' onclick='return " + updateCallback + "(" + ID + ", value, \"" + oid + "\");'>";
        } else {
            htmlControl += "<a href='" + link + "'>";
        }
        htmlControl += name;
        htmlControl += "</a>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>";
        return htmlControl;
    }
    /**
     * Generates the HTML code for a static text element.
     * name - Name of the element to be displayed to the user.
     * text - Text to be displayed in the element.
     * isSubList - Boolean stating if control is in a sublist.
     */
    function generateHTMLText(name, text, isSubList) {
        var oid = name.replace(" ", "-");
        var htmlControl = "";
        if (typeof isSubList != undefined && isSubList) {
            htmlControl += "<li class='sub-list-item row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item row' data-oid='" + oid + "'>";
        }
        htmlControl += "<div class='column-2'>" + name + "</div>";
        htmlControl += "<div class='content-center column-2'>" + text + "</div>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>";
        return htmlControl;
    }
    /**
     * Generates the HTML code for a toggleable control.
     * name - Name of the control to be displayed to the user.
     * initialVal - Initial value of the control.
     * ID - C++ ID for the control.
     * updateCallback - The name of the function to be called when relaying the current state of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     * isSubList - Boolean stating if control is in a sublist.
     */
    function generateHTMLToggle(name, initialVal, ID, updateCallback, updateInRealTime, isSubList) {
        var oid = name.replace(" ", "-");
        var htmlControl = "";
        if (typeof isSubList != undefined && isSubList) {
            htmlControl += "<li class='sub-list-item row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item row' data-oid='" + oid + "'>";
        }
        htmlControl += "<div class='column-2'>" + name + "</div>";
        htmlControl += "<div class='content-center column-2'>";
        htmlControl += "<div class='checkbox'>";
        if (typeof ID != undefined && typeof updateCallback != undefined) {
            if (typeof updateInRealTime != undefined && updateInRealTime) {
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
    }
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
    function generateHTMLSlider(name, min, max, initialVal, intervalRes, ID, updateCallback, updateInRealTime, isSubList) {
        var oid = name.replace(" ", "-");
        var htmlControl = "";
        if (typeof isSubList != undefined && isSubList) {
            htmlControl += "<li class='sub-list-item row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item row' data-oid='" + oid + "'>";
        }
        htmlControl += "<div class='column-2'>" + name + "</div>";
        htmlControl += "<div class='content-center column-2'>";
        if (typeof ID != undefined && typeof updateCallback != undefined) {
            if (typeof updateInRealTime != undefined && updateInRealTime) {
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
    }
    /**
     * Generates the HTML code for a combobox control.
     * name - Name of the control to be displayed to the user.
     * vals - Array of values to exist in the combobox.
     * initialVal - The initial value of the control. Takes a value from the array of values provided.
     * ID - C++ ID for the control.
     * updateCallback - The name of the function to be called when relaying the current state of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     * isSubList - Boolean stating if control is in a sublist.
     */
    function generateHTMLCombo(name, vals, initialVal, ID, updateCallback, updateInRealTime, isSubList) {
        var oid = name.replace(" ", "-");
        var htmlControl = "";
        if (typeof isSubList != undefined && isSubList) {
            htmlControl += "<li class='sub-list-item row' data-oid='" + oid + "'>";
        } else {
            htmlControl += "<li class='list-item row' data-oid='" + oid + "'>";
        }
        htmlControl += "<div class='column-2'>" + name + "</div>";
        htmlControl += "<div class='content-center column-2'>";
        if (typeof ID != undefined && typeof updateCallback != undefined) {
            if (typeof updateInRealTime != undefined && updateInRealTime) {
                htmlControl += "<select onchange='" + updateCallback + "(" + ID + ", value, \"" + oid + "\")'>";
            } else {
                htmlControl += "<select onchange='controls[" + ID + "] = value;'>";
            }
        } else {
            htmlControl += "<select>";
        }
        $.each(vals, function (i, v) {
            var vid = v.replace(" ", "-");
            var init = "";
            if (v == initialVal) {
                init = "selected";
            }
            htmlControl += "<option value='" + vid + "'" + init + ">" + v + "</option>";
        })
        htmlControl += "</select>";
        htmlControl += "</div>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>";
        return htmlControl;
    }
    /**
     * Generates the HTML code for a sublist.
     * name - Name of the control to be displayed to the user.
     * subItems - Array of objects detailing items to exist in the sublist.
     */
    function generateHTMLSubList(name, subItems) {
        var lid = name.replace(" ", "-");
        var htmlControl = "<li class='list-item row' data-oid='" + lid + "'>";
        htmlControl += name;
        htmlControl += "<div class='sub-list-wrapper'>"
        htmlControl += "<ul class='sub-list'>";
        $.each(subItems, function (i, v) {
            switch (v["type"]) {
                case "click":
                    htmlContent += generateHTMLClickable(v["name"], v["link"], v["ID"], v["updateCallback"], true);
                    break;
                case "text":
                    htmlContent += generateHTMLText(v["name"], v["text"], true);
                    break;
                case "toggle":
                    htmlContent += generateHTMLToggle(v["name"], v["initialVal"], v["ID"], v["updateCallback"], v["updateInRealTime"], true);
                    break;
                case "slider":
                    htmlContent += generateHTMLSlider(v["name"], v["min"], v["max"], v["initialVal"], v["intervalRes"], v["ID"], v["updateCallback"], v["updateInRealTime"], true);
                    break;
                case "combo":
                    htmlContent += generateHTMLCombo(v["name"], v["vals"], v["initialVal"], v["ID"], v["updateCallback"], v["updateInRealTime"], true);
                    break;
            }
        });
        htmlControl += "</ul>"
        htmlControl += "</div>";
        htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
        htmlControl += "</li>"
        return htmlControl;
    }


    /**
     * Creates a category for the options menu.
     * name - Name of the category to be displayed to the user.
     */
    this.createCategory = function (name) {
        var cid = name.replace(" ", "-");
        var htmlCategory = "<li class='list-header' data-category='" + cid + "'>" + name + "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div></li>";
        $("#options").append(htmlCategory);
    }
    /**
     * Generates a clickable control (i.e. a link or otherwise button-like control).
     * name - Name of the control to be displayed to the user.
     * link - Path to the file the button should take the user to.
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     * ID - C++ ID for the control.
     * updateCallback - The name of the function to be called upon a change of state to the control.
     */
    this.generateClickable = function (name, link, category, description, ID, updateCallback) {
        var oid = name.replace(" ", "-");
        var cid = category.replace(" ", "-");
        placeControl(cid, generateHTMLLink(name, link, ID, updateCallback));
        addDescription(oid, description);
    }
    /**
     * Generates a static text element.
     * name - Name of the control to be displayed to the user.
     * text - Text to be displayed in the element.
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     */
    this.generateText = function (name, text, category, description) {
        var oid = name.replace(" ", "-");
        var cid = category.replace(" ", "-");
        placeControl(cid, generateHTMLText(name, text));
        addDescription(oid, description);
    }
    /**
     * Generates a toggle control.
     * name - Name of the control to be displayed to the user.
     * initialVal - The initial value of the control. Takes either an empty string or "checked".
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     * ID - C++ ID for the control.
     * updateCallback - The callback function to be called on user update of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     */
    this.generateToggle = function (name, initialVal, category, description, ID, updateCallback, updateInRealTime) {
        if (typeof updateInRealTime != undefined && !updateInRealTime) {
            controls[ID] = initialVal;
        }
        var oid = name.replace(" ", "-");
        var cid = category.replace(" ", "-");
        placeControl(cid, generateHTMLToggle(name, initialVal, ID, updateCallback, updateInRealTime));
        addDescription(oid, description);
    }
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
     */
    function generateSlider(name, min, max, initialVal, intervalRes, category, description, ID, updateCallback, updateInRealTime) {
        if (typeof updateInRealTime != undefined && !updateInRealTime) {
            controls[ID] = initialVal;
        }
        var oid = name.replace(" ", "-");
        var cid = category.replace(" ", "-");
        placeControl(cid, htmlControl);
        addDescription(oid, description);
    }
    /**
     * Generates a combobox control.
     * name - Name of the control to be displayed to the user.
     * vals - Array of values to exist in the combobox.
     * initialVal - The initial value of the control. Takes a value from the array of values provided.
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     * ID - C++ ID for the control.
     * updateCallback - The callback function to be called on user update of the control.
     * updateInRealTime - Boolean stating if the control's updateCallback should be called on state changes.
     */
    this.generateCombo = function (name, vals, initialVal, category, description, ID, updateCallback, updateInRealTime) {
        if (typeof updateInRealTime != undefined && !updateInRealTime) {
            controls[ID] = initialVal;
        }
        var oid = name.replace(" ", "-");
        var cid = category.replace(" ", "-");
        placeControl(cid, generateHTMLCombo(name, vals, initialVal, ID, updateCallback, updateInRealTime));
        addDescription(oid, description);
    }
    /**
     * Generates a sublist.
     * name - Name of the control to be displayed to the user.
     * subItems - Array of objects detailing items to exist in the sublist.
     * category - The category to place the control under.
     * description - The description to be displayed, describing the control's effect on the game.
     */
    this.generateSubList = function (name, subItems, category, description) {
        var lid = name.replace(" ", "-");
        var cid = category.replace(" ", "-");
        placeControl(cid, generateHTMLSubList(name, subItems));
        addDescription(lid, description);
    }
}
