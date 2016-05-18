(function() {
  // Submit Button -------------------------------------------------------------

  /**
   * @module SubmitButton
   */

  var SubmitButton = {
    DOM: {
      handleClick: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var form     = $(this).closest('.comment-form')
        var template = $(this).closest('.event-display').find('.comment-template');
        var dropZone = $(this).closest('.event-display').find('.comments');
        var eventId  = form.data('event-id');
        var name     = form.find('input').val();
        var text     = form.find('textarea').val();

  //    Validation

        if(!name || !text) { return; }

  //    HTML

        var html = template.clone();
        html.find('.comment-name').text(name).end()
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

  //    Clear form

        form.find('input').val('');
        form.find('textarea').val('');
      }
    }
  };


  // Textarea ------------------------------------------------------------------

  /**
   * @module Textarea
   */

  var Textarea = {
    DOM: {
      handleKeyup: function() {
        var textarea = this;
        var maxHeight = 200;

        while (textarea.scrollHeight > textarea.clientHeight && !window.opera && textarea.clientHeight < maxHeight) {
          textarea.style.overflow = 'hidden';
          textarea.style.height = textarea.clientHeight + 12 + 'px';
        }

        if (textarea.scrollHeight > textarea.clientHeight) { textarea.style.overflow = 'auto'; }
      }
    }
  };


  // Window onload -------------------------------------------------------------

  $(window).on('load', function() {
    $('.comment-form-submit-button').on('click', SubmitButton.DOM.handleClick);
    $('.comment-form textarea').on('keyup', Textarea.DOM.handleKeyup);
  });
})();
