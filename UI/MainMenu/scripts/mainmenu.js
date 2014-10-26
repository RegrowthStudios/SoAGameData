// Sliders child options into/out of view when called.
function slide(content) {
    var wrapper = content.parent();
    var contentHeight = content.outerHeight(true);
    var wrapperHeight = wrapper.height();

    var lis = $(".menu-child-options-inner-wrapper");
    var ind = lis.index(wrapper);

    for (var x = 0; x < lis.length; ++x) {
        if (x != ind) {
            if ($(lis[x]).hasClass('expand')) {
                $(lis[x]).toggleClass('expand')
                        .addClass('transition').css('height', 0);
            }
        }
    }

    wrapper.toggleClass('expand');

    if (wrapper.hasClass('expand')) {
        setTimeout(function () {
            wrapper.stop(true, true).animate({
                'height': contentHeight
            }, 235);
        }, 10);
    } else {
        setTimeout(function () {
            wrapper.stop(true, true).css('height', wrapperHeight);
            setTimeout(function () {
                wrapper.animate({
                    'height': 0
                }, 235);
            }, 10);
        }, 10);
    }
}

// Handle the opening/closing of child options by user.
$(document).ready(function () {
    $(".menu-child-options-inner-wrapper").css('height', 0);

    $("#menu-options > li > a").click(function () {
        slide($(".menu-child-options", $(this).parent()));
    });
});

// Handle menu item descriptions.
$(document).ready(function () {
    var menuOpts = $("#menu-options li > a");
    var menuOptsDescs = $("#menu-item-descriptions > div");

    $("#menu-item-descriptions > div").hide();

    menuOpts.mouseover(function () {
        var midId = $(this).data("mid-id");
        for (var x = 0; x < menuOpts.length; ++x) {
            if ($(menuOptsDescs[x]).data("mid-id") == midId) {
                $(menuOptsDescs[x]).show(200);
            } else {
                $(menuOptsDescs[x]).stop(false, true);
            }
        }
    }).mouseout(function () {
        var midId = $(this).data("mid-id");
        for (var x = 0; x < menuOpts.length; ++x) {
            if ($(menuOptsDescs[x]).data("mid-id") == midId) {
                $(menuOptsDescs[x]).hide(75);
            } else {
                $(menuOptsDescs[x]).stop(false, true);
            }
        }
    });
});