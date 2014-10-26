// Handles overlays
$(document).ready(function () {
    $(".pop-overlay").click(function (e) {
        $(".overlay[data-overlay-id='" + $(e.currentTarget).data("overlay-id") + "']").fadeIn(1000);
    });
    $(".close").click(function () {
        $(".overlay").fadeOut(500);
    });
});

// Handles menu item hover
$(document).ready(function () {
    $(".menu-item").mouseenter(function () {
        $(this).children(".hover")[0].play();
    });
});

// Handles sub menu expand/contract
$(document).ready(function () {
    $(".menu-item-expandable").click(function () {
        if ($(this).hasClass("expanded")) {
            $(this).children(".contract")[0].play();
        } else {
            $(this).children(".expand")[0].play();
        }
        $(this).toggleClass("expanded");
    });
});