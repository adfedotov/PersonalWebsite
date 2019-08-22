const main = function() {
  $(".menu a").on('click', function(event) {
    var scrollTarget = $(this).attr('to');
    $('html, body').animate({
      scrollTop: $(scrollTarget).offset().top
    }, 2000);
    return false;
  });
}

$(document).ready(main);
