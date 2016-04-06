$(window).on('load', function() {
  var token = $('meta[name="csrf-token"]').attr('content');
  $.ajaxPrefilter(function(options, originalOptions, xhr) {
    return xhr.setRequestHeader('X-CSRF-Token', token);
  });

  $('.comment-form-submit-button').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var form     = $(this).closest('.comment-form')
    var template = $(this).closest('.event-display').find('.comment-template');
    var dropZone = $(this).closest('.event-display').find('.comments');
    var eventId  = form.data('event-id');
    var name     = form.find('input').val();
    var text     = form.find('textarea').val();

//  Validation

    if(!name || !text) { return; }

//  HTML

    var html = template.clone();
    html.find('.comment-created-at').text('some time').end()
        .find('.comment-name').text(name).end()
        .find('.comment-text').text(text).end()
        .removeClass('comment-template')
        .appendTo(dropZone);

    $.ajax({
      type: 'POST',
      url: '/comments',
      data: {
        comment: {
          name: name,
          text: text,
          event_id: eventId
        }
      }
    });

    window.setTimeout(function() {
      html.removeClass('comment-new');
    }, 100);

//  Clear form

    form.find('input').val('');
    form.find('textarea').val('');
  });
});
