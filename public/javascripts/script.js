const main = function() {
  $(".menu a").on('click', function(event) {
    var scrollTarget = $(this).attr('to');
    $('html, body').animate({
      scrollTop: $(scrollTarget).offset().top
    }, 2000);
    return false;
  });

  $(".admin a").on('click', function(event) {
  	var code = $(".admin input").val();
  	$.post($(location).attr('href'), code, function() {
      window.location.href = "http://127.0.0.1:3000/admin/edit";
    });
  	return false;
  });
}

$(document).ready(main);
