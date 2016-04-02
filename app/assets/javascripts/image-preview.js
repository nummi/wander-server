$(document).ready(function($) {
  var displayFullscreenImage = function(src) {
    var windowWidth  = $(window).width();
    var windowHeight = $(window).height();

    var container = $('<div class="full-image-container"><span class="close-circle">&times;</span><img src="' + src + '"></div>');
    $('body').append(container.hide());
    container.fadeIn(100);
  };

  var hideFullscreenImage = function() {
    $('.full-image-container').fadeOut(100, null, function() {
      $(this).remove();
    });
  };

  $('body').on('click', '.full-image-container', function() {
    hideFullscreenImage();
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      hideFullscreenImage();
    }
  });

  $('.event-display-small-image').on('click', function() {
    displayFullscreenImage($(this).data('full-src'));
  });
});
