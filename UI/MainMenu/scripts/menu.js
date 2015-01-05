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
        var midId = $(this).data("mid-id");
        for (var x = 0; x < opts.length; ++x) {
            if ($(optDescs[x]).data("mid-id") == midId) {
                $(optDescs[x]).show(0);
            } else {
                $(optDescs[x]).stop(false, true);
            }
        }
    })
    opts.on('mouseout', function () {
        var midId = $(this).data("mid-id");
        for (var x = 0; x < opts.length; ++x) {
            if ($(optDescs[x]).data("mid-id") == midId) {
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

/**
 * Creates a category for the options menu.
 * name - Name of the category to be displayed to the user.
 */
function createCategory(name) {
    var cid = name.replace(" ", "-");
    //<li class="header" data-category="disp">Display Options</li>
    var htmlCategory = "<li class='list-header' data-category='" + cid + "'>" + name + "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div></li>";
    $("#options").append(htmlCategory);
}

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
function addDescription(oid, description) {
    if (typeof description == "string") {
        var htmlDescriptor = "<div class='helper' data-mid-id='" + oid + "'>" + description + "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div></div>"
        $(htmlDescriptor).appendTo("#options-helper-wrapper").hide();
        optDescs = $("#options-helper-wrapper > div");
        opts = $("#options > .list-item");
        refreshDescControl();
    }
}

function generateLink(name, link, category, description) {
    var oid = name.replace(" ", "-");
    var cid = category.replace(" ", "-");
    var htmlControl = "<li class='list-item clickable row' data-mid-id='" + oid + "'>";
    htmlControl += "<a href='" + link + "'>";
    htmlControl += name;
    htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
    htmlControl += "</a>";
    htmlControl += "</li>";
    placeControl(cid, htmlControl);
    addDescription(oid, description);
}

function generateText(name, text, category, description) {
    var oid = name.replace(" ", "-");
    var cid = category.replace(" ", "-");
    var htmlControl = "<li class='list-item row' data-mid-id='" + oid + "'>";
    htmlControl += "<div class='column-2'>" + name + "</div>";
    htmlControl += "<div class='content-center column-2'>" + text + "</div>";
    htmlControl += "<div class='content-corner-top-right content-corner'></div><div class='content-corner-bottom-right content-corner'></div><div class='content-corner-top-left content-corner'></div><div class='content-corner-bottom-left content-corner'></div>";
    htmlControl += "</li>";
    placeControl(cid, htmlControl);
    addDescription(oid, description);
}