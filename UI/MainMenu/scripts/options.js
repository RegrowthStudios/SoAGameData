var controls = [];

/**
 * Creates a toggle control for the options menu.
 * ID - C++ ID for the control.
 * name - Name of the control to be displayed to the user.
 * initialVal - The initial value of the toggle. Takes either an empty string or "checked".
 * updateInRealTime - Should changes to this control be reflected in-game immediately?
 * description - The description to be displayed, describing the control's effect on the game.
 * category - The category to place the control under.
 */
function generateToggle(ID, name, initialVal, updateInRealTime, category, description) {
    controls[ID] = initialVal;
    var oid = name.replace(" ", "-");
    var cid = category.replace(" ", "-");
    var htmlControl = "<li class='list-item row' data-mid-id='" + oid + "'>";
    htmlControl += "<div class='column-2'>" + name + "</div>";
    htmlControl += "<div class='content-center column-2'>";
    htmlControl += "<div class='checkbox' data-id='" + ID + "'>";
    htmlControl += "<input id='" + oid + "' type='checkbox' name='" + oid + "'" + initialVal + "'" + (updateInRealTime ? " oninput='handleToggleChange(value, " + ID + ")'" : "") + ">";
    htmlControl += "<label for='" + oid + "'></label>";
    htmlControl += "</div>";
    htmlControl += "</div>";
    htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
    htmlControl += "</li>";
    placeControl(cid, htmlControl);
    addDescription(oid, description);
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
 * description - The description to be displayed, describing the control's effect on the game.
 * category - The category to place the control under.
 */
function generateSlider(ID, name, min, max, initialVal, intervalRes, updateInRealTime, category, description) {
    controls[ID] = initialVal;
    var oid = name.replace(" ", "-");
    var cid = category.replace(" ", "-");
    var htmlControl = "<li class='list-item row' data-mid-id='" + oid + "'>";
    htmlControl += "<div class='column-2'>" + name + "</div>";
    htmlControl += "<div class='content-center column-2'>";
    htmlControl += "<input type='range' min='" + min + "' max='" + max + "' value='" + ((initialVal >= min && initialVal <= max) ? initialVal : min) + "' id='" + oid + "' step='" + intervalRes + "' oninput='" + (updateInRealTime ? "handleSliderChange" : "updateSliderOutput") + "(value, \"" + oid + "\"," + ID + ")'>";
    htmlControl += "<output for='" + oid + "' id='" + oid + "-output'>" + initialVal + "</output>";
    htmlControl += "</div>";
    htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
    htmlControl += "</li>";
    placeControl(cid, htmlControl);
    addDescription(oid, description);
}

/**
 * Creates a combobox control for the options menu.
 * ID - C++ ID for the control.
 * name - Name of the control to be displayed to the user.
 * vals - An array of values to exist in the combobox.
 * initialVal - The initial value of the combobox. Takes any individual value of vals.
 * updateInRealTime - Should changes to this control be reflected in-game immediately?
 * description - The description to be displayed, describing the control's effect on the game.
 * category - The category to place the control under.
 */
function generateCombo(ID, name, vals, initialVal, updateInRealTime, category, description) {
    controls[ID] = initialVal;
    var oid = name.replace(" ", "-");
    var cid = category.replace(" ", "-");
    var htmlControl = "<li class='list-item row' data-mid-id='" + oid + "'>";
    htmlControl += "<div class='column-2'>" + name + "</div>";
    htmlControl += "<div class='content-center column-2'>";
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
    htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
    htmlControl += "</li>";
    placeControl(cid, htmlControl);
    addDescription(oid, description);
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