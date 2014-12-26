//Generate Controls
function createCategory(name) {
    var cid = name.replace(" ", "-");
    //<li class="header" data-category="disp">Display Options</li>
    var htmlCategory = "<li class='option-category' data-category='" + cid + "'>" + name + "</li>";
    $("#video-options").append(htmlCategory);
}

var controls = [];

/**
 * Creates a toggle control for the options menu.
 * ID - C++ ID for the control.
 * name - Name of the control to be displayed to the user.
 * initialVal - The initial value of the toggle. Takes either an empty string or "checked".
 * updateInRealTime - Should changes to this control be reflected in-game immediately?
 * description - The description to be displayed, describing the controls effect on the game.
 * category - The category to place the control under.
 */
function generateToggle(ID, name, initialVal, updateInRealTime, description, category) {
    controls[ID] = initialVal;
    var oid = name.replace(" ", "-");
    var cid = category.replace(" ", "-");
    var htmlControl = "<li class='video-option' data-mid-id='" + oid + "'>";
    htmlControl += "<div class='option'>" + name + "</div>";
    htmlControl += "<div class='option-value'>";
    htmlControl += "<div class='checkbox' data-id='" + ID + "'>";
    htmlControl += "<input id='" + oid + "' type='checkbox' name='" + oid + "'" + initialVal + "'" + (updateInRealTime ? " oninput='handleToggleChange(value, " + ID + ")'" : "") + ">";
    htmlControl += "<label for='" + oid + "'></label>"
    htmlControl += "</div>";
    htmlControl += "</div>";
    htmlControl += "</li>";
    var cat = $(".option-category[data-category=" + cid + "]");
    var elems = cat.nextUntil(".option-category");
    if (elems.length == 0) {
        cat.after(htmlControl);
    } else {
        elems.last().after(htmlControl);
    }
    var htmlDescriptor = "<div data-mid-id='" + oid + "'>" + description + "</div>"
    $(htmlDescriptor).appendTo("#video-options-helper-wrapper").hide();
    videoOptsDescs = $("#video-options-helper-wrapper > div");
    videoOpts = $("#video-options > .video-option");
    refreshDescControl();
}


/**
 * Creates a slider control for the options menu.
 * ID - C++ ID for the control.
 * name - Name of the control to be displayed to the user.
 * min - The minimum value of the slider.
 * max - The maximum value of the slider.
 * initialVal - The initial value of the slider. Takes a value between min and max.
 * intervalRes - The size of each interval in the slider.
 * updateInRealTime - Should changes to this control be reflected in-game immediately?
 * description - The description to be displayed, describing the controls effect on the game.
 * category - The category to place the control under.
 */
function generateSlider(ID, name, min, max, initialVal, intervalRes, updateInRealTime, description, category) {
    controls[ID] = initialVal;
    var oid = name.replace(" ", "-");
    var cid = category.replace(" ", "-");
    var htmlControl = "<li class='video-option' data-mid-id='" + oid + "'>";
    htmlControl += "<div class='option'>" + name + "</div>";
    htmlControl += "<div class='option-value'>";
    htmlControl += "<input type='range' min='" + min + "' max='" + max + "' value='" + ((initialVal >= min && initialVal <= max) ? initialVal : min) + "' id='" + oid + "' step='" + intervalRes + "' oninput='" + (updateInRealTime ? "handleSliderChange" : "updateSliderOutput") + "(value, \"" + oid + "\"," + ID + ")'>";
    htmlControl += "<output for='" + oid + "' id='" + oid + "-output'>" + initialVal + "</output>";
    htmlControl += "</div>";
    htmlControl += "</li>";
    var cat = $(".option-category[data-category=" + cid + "]");
    var elems = cat.nextUntil(".option-category");
    if (elems.length == 0) {
        cat.after(htmlControl);
    } else {
        elems.last().after(htmlControl);
    }
    var htmlDescriptor = "<div data-mid-id='" + oid + "'>" + description + "</div>"
    $(htmlDescriptor).appendTo("#video-options-helper-wrapper").hide();
    videoOptsDescs = $("#video-options-helper-wrapper > div");
    videoOpts = $("#video-options > .video-option");
    refreshDescControl();
}

/**
 * Creates a combobox control for the options menu.
 * ID - C++ ID for the control.
 * name - Name of the control to be displayed to the user.
 * vals - An array of values to exist in the combobox.
 * initialVal - The initial value of the combobox. Takes any individual value of vals.
 * updateInRealTime - Should changes to this control be reflected in-game immediately?
 * description - The description to be displayed, describing the controls effect on the game.
 * category - The category to place the control under.
 */
function generateCombo(ID, name, vals, initialVal, updateInRealTime, description, category) {
    controls[ID] = initialVal;
    var oid = name.replace(" ", "-");
    var cid = category.replace(" ", "-");
    var htmlControl = "<li class='video-option' data-mid-id='" + oid + "'>";
    htmlControl += "<div class='option'>" + name + "</div>";
    htmlControl += "<div class='option-value'>";
    htmlControl += "<select" + (updateInRealTime ? " onchange='handleComboChange(value, " + ID + ")'" : "") + ">";
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
    htmlControl += "</li>";
    var cat = $(".option-category[data-category=" + cid + "]");
    var elems = cat.nextUntil(".option-category");
    if (elems.length == 0) {
        cat.after(htmlControl);
    } else {
        elems.last().after(htmlControl);
    }
    var htmlDescriptor = "<div data-mid-id='" + oid + "'>" + description + "</div>"
    $(htmlDescriptor).appendTo("#video-options-helper-wrapper").hide();
    videoOptsDescs = $("#video-options-helper-wrapper > div");
    videoOpts = $("#video-options > .video-option");
    refreshDescControl();
}

function updateSliderOutput(value, oid) {
    $("#" + oid + "-output").val(value);
}
function handleSliderChange(value, oid, ID) {
    updateSliderOutput(value, oid);
    controls[ID] = value;
    // Update setting in C++
    App.updateSetting(ID, value);
}

function handleToggleChange(value, ID) {
    controls[ID] = value;
    App.updateSetting(ID, value);
}

function handleComboChange(value, ID) {
    controls[ID] = value;
    App.updateSetting(ID, value);
}

function updateSettings() {
    $.each(controls, function (i, v) {
        App.updateSetting(i, v);
    });
}


var videoOpts;
var videoOptsDescs;
// Handle menu item descriptions.
function refreshDescControl() {
    videoOpts.off('mouseover mouseout');
    videoOpts.on('mouseover', function () {
        var midId = $(this).data("mid-id");
        for (var x = 0; x < videoOpts.length; ++x) {
            if ($(videoOptsDescs[x]).data("mid-id") == midId) {
                $(videoOptsDescs[x]).show(200);
            } else {
                $(videoOptsDescs[x]).stop(false, true);
            }
        }
    })
    videoOpts.on('mouseout', function () {
        var midId = $(this).data("mid-id");
        for (var x = 0; x < videoOpts.length; ++x) {
            if ($(videoOptsDescs[x]).data("mid-id") == midId) {
                $(videoOptsDescs[x]).hide(75);
            } else {
                $(videoOptsDescs[x]).stop(false, true);
            }
        }
    });
}