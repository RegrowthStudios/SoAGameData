$('#item-wrapper a').mouseenter(function () {
    console.log($(this).data('panel'));
    if ($(this).data('panel')) {
        $('.panel').hide();
        $('#' + $(this).data('panel')).show();
    }
    });
$('#item-wrapper').mouseleave(function () {
    $('.panel').hide();
});