(function() {
  const ANIMATION_EVENT_END = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';
  // Submit Button -------------------------------------------------------------

  /**
   * @module SubmitButton
   */

  const SubmitButton = {
    DOM: {
      handleClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const button   = $(this);
        const form     = button.closest('.comment-form')
        const dropZone = button.closest('.event-display').find('.comments');
        const eventId  = Form.DOM.getEventId(form);
        const name     = form.find('input').val();
        const text     = form.find('textarea').val();

  //    Validation

        if(!Form.DOM.isValid(form)) {
          Form.DOM.invalidAnimation(form);
          return;
        }

  //    HTML

        const html = Comment.DOM.getTemplate();

        html.find('.comment-name').text(name).end()
            .find('.comment-text').text(text).end()
            .removeClass('comment-template')
            .appendTo(dropZone);


        Comment.post({
          name: name,
          text: text,
          event_id: eventId
        });

        // CSS background color transition
        window.setTimeout(function() {
          html.removeClass('comment-new');
        }, 100);

        Form.DOM.clearValues(form);
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


  // Comment ------------------------------------------------------------------

  /**
   * @module Comment
   */

  const Comment = {
    post(payload) {
      return $.ajax({
        type: 'POST',
        url: '/api/comments',
        data: { comment: payload }
      });
    },

    DOM: {
      getTemplate() {
        return $('.event-display:first').find('.comment-template')
                                        .clone();
      }
    }
  };


  // Form ---------------------------------------------------------------------

  /**
   * @module Form
   */

  const Form = {
    DOM: {
      clearValues(form) {
        form.find('input').val('');
        form.find('textarea').val('');
      },

      getEventId(form) {
        return $(form).data('event-id');
      },

      isValid(form) {
        const name = form.find('input').val();
        const text = form.find('textarea').val();

        return name && text;
      },

      invalidAnimation(form) {
        form.find('.comment-form-field').addClass('shake-slow').one(ANIMATION_EVENT_END, function(e) {
          $(this).removeClass('shake-slow');
        });
      }
    }
  };


  // Window onload -------------------------------------------------------------

  $(window).on('load', function() {
    $('.comment-form-submit-button').on('click', SubmitButton.DOM.handleClick);
    $('.comment-form textarea').on('keyup', Textarea.DOM.handleKeyup);
  });
})();
