$(window).on('load', function() {
  $('.comment-reaction').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var reactions = $(this).closest('.comments-reactions');
    var eventId   = reactions.attr('data-event-id');
    var payload   = [];
    var clickedReaction = $(this);
    var clickedCode = $(this).attr('data-code');

    reactions.find('.comment-reaction').each(function(i, r) {
      var code  = $(r).attr('data-code');
      var count = parseInt($(r).attr('data-count'));
      var desc  = $(r).attr('data-description');

      if(clickedCode === code) {
        count = count + 1;
        $(r).attr('data-count', count);
        $(r).find('.comment-reaction-count').text(count);
      }

      payload.push({
        code:  code,
        count: count,
        desc:  desc
      });
    });

    $.ajax({
      type: 'POST',
      url: '/events/' + eventId + '/react',
      data: {
        event: {
          reactions: payload,
        }
      }
    });
  });
});
