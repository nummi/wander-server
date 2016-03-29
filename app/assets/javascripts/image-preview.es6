window.displayFullscreenImage = function(src) {
  const windowWidth  = $(window).width();
  const windowHeight = $(window).height();

  const container = $('<div class="full-image-container"><span>&times;</span><img src="' + src + '"></div>');
  $('body').append(container.hide());
  container.fadeIn(100);
};

$(document).ready(function($){
  $('body').on('click', '.full-image-container', function() {
    $('.full-image-container').fadeOut(100, null, function() {
      $(this).remove();
    });
  });

  $('.event-display-small-image').on('click', function() {
    displayFullscreenImage($(this).data('full-src'));
  });
});
