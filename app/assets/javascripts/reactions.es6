(function() {
  const ANIMATION_EVENT_END = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';
  /**
   * @module Reaction
   * --------------------------------------------------------------------------
   */

  const Reaction = {
    /**
     * @method save
     * @param {Integer} eventId
     * @param {Object} payload
     */
    save(eventId, payload) {
      $.ajax({
        type: 'POST',
        url: '/api/events/' + eventId + '/react',
        dataType: 'json',
        data: {
          event: {
            reactions: payload
          }
        }
      });
    }
  };

  Reaction.DOM = {
    /**
     * @method handleClick
     * @param {Event} e
     */
    handleClick(e) {
      e.preventDefault();
      e.stopPropagation();

      const reaction = $(this);

      if(reaction.hasClass('already-voted')) { return; }

      Reaction.DOM.incrementCountForReaction(reaction);
      Reaction.DOM.animate(reaction);

      const reactions = reaction.closest('.comments-reactions')
                                .find('.comment-reaction');

      const eventId = reaction.closest('.comments-reactions')
                               .attr('data-event-id');

      const payload = Reaction.DOM.createPayloadFromReaction(reaction);
      Reaction.save(eventId, payload);
    },

    /**
     * @method incrementCountForReaction
     * @param {jquery object} reaction
     */
    incrementCountForReaction(reaction) {
      const newCount = parseInt(reaction.attr('data-count')) + 1;

      reaction.attr('data-count', newCount)
              .find('.comment-reaction-count').text(newCount);
    },

    /**
     * @method animate
     * @param {jquery object} reaction
     */
    animate(reaction) {
      $(reaction).addClass('clicked')
                 .addClass('already-voted')
                 .one(ANIMATION_EVENT_END, function() {
                   $(this).removeClass('clicked');
                 });
    },

    /**
     * @method createPayloadFromReaction
     * @param {jquery object} reaction
     */
    createPayloadFromReaction(reaction) {
      const reactions = $(reaction).closest('.comments-reactions').find('.comment-reaction');
      let payload = [];

      reactions.each(function(i, r) {
        payload.push({
          code:  $(r).attr('data-code'),
          count: parseInt($(r).attr('data-count')),
          desc:  $(r).attr('data-description')
        });
      });

      return payload;
    }
  };

  $(window).on('load', function() {
    $('.comment-reaction').on('click', Reaction.DOM.handleClick);
  }); // window.onload
})();

