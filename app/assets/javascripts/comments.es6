(function() {
  const ANIMATION_EVENT_END = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';
  // Submit Button -------------------------------------------------------------

  /**
   * @module SubmitButton
   */

  const SubmitButton = {
    postComment(payload) {
      $.ajax({
        type: 'POST',
        url: '/comments',
        data: { comment: payload }
      });
    },

    DOM: {
      handleClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const button   = $(this);
        const form     = button.closest('.comment-form')
        const dropZone = button.closest('.event-display').find('.comments');
        const eventId  = form.data('event-id');
        const name     = form.find('input').val();
        const text     = form.find('textarea').val();

  //    Validation

        if(!name || !text) {
          form.find('.comment-form-field').addClass('shake-slow').one(ANIMATION_EVENT_END, function(e) {
            $(this).removeClass('shake-slow');
          });

          return;
        }

  //    HTML

        const html = button.closest('.event-display')
                           .find('.comment-template')
                           .clone();

        html.find('.comment-name').text(name).end()
            .find('.comment-text').text(text).end()
            .removeClass('comment-template')
            .appendTo(dropZone);


        SubmitButton.postComment({
          name: name,
          text: text,
          event_id: eventId
        });

        // CSS background color transition
        window.setTimeout(function() {
          html.removeClass('comment-new');
        }, 100);

        SubmitButton.DOM.clearForm(form);
      },

      clearForm(form) {
        form.find('input').val('');
        form.find('textarea').val('');
      }
    }
  };


  // Textarea ------------------------------------------------------------------

  /**
   * @module Textarea
   */

  const Textarea = {
    DOM: {
      handleKeyup() {
        const textarea = this;
        const maxHeight = 200;

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
