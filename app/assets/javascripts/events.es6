(function() {
  let mapLoaded = false;

  /**
   * @method killDOMEvent
   * @param {Event} e
   */
  const killDOMEvent = function(e) {
    e.preventDefault();
    e.stopPropagation();
  };

  // Map Loading Spinner ------------------------------------------------------

  /**
   * @module MapLoadingSpinner
   */
  const MapLoadingSpinner = {
    show() {
      const spinner = $('<div class="loading-spinner"></div>')
      $('body').append(spinner);

      MapLoadingSpinner.position(spinner);
    },

    hide() {
      $('.loading-spinner').remove();
    },

    position(spinner) {
      const map = $('.display-view-map-section');

      spinner.css({
        top:  map.offset().top  + (map.height()/2),
        left: map.offset().left + (map.width()/2)
      });
    }
  };


  // Photo ---------------------------------------------------------------------

  /**
   * @module Photo
   */
  const Photo = {
    /**
     * @method load
     * @param {String} src url to image source
     * @returns {Object} Image object
     */
    load(src) {
      const img = new Image();
      img.src = src;
      return img;
    }
  };

  /**
   * @module Photo.DOM
   */
  Photo.DOM = {
    displayFullscreen(src) {
      $('.full-image-container').remove();

      const windowWidth  = $(window).width();
      const windowHeight = $(window).height();
      const touchDevice  = 'ontouchstart' in window;

      const desktopControls = `
        <span class="button-circle button-circle--white image-zoom-in">+</span>
        <span class="button-circle button-circle--white image-zoom-out">&ndash;</span>
      `;

      const touchControls = '';

      const html = `
        <div class="full-image-container">
          <span class="button-circle button-circle--white image-close">&times;</span>
          <div class="carousel-button previous">&lt;</div>
          <div class="carousel-button next">&gt;</div>
          ${touchDevice ? touchControls : desktopControls}
          <img src="${src}">
        </div>
      `;

      const container = $(html);
      $('body').append(container.hide());
      container.fadeIn(100);

      $('.full-image-container img').panzoom({
        minScale: 0.2,
        maxScale: 1,
      });

      $('.full-image-container .carousel-button').on('click', function() {
        const direction = $(this).hasClass('next') ? 'next' : 'prev';
        Event.DOM.stepActiveEvent(direction);
      });
    },

    hideFullscreen() {
      $('.full-image-container img').panzoom('destroy');
      $('.full-image-container').fadeOut(100, null, function() {
        $(this).remove();
      });
    },

    zoomIn() {
      $('.full-image-container img').panzoom('zoom', false);
    },

    zoomOut() {
      $('.full-image-container img').panzoom('zoom', true);
    }
  };


  // Event ---------------------------------------------------------------------

  /**
   * @module Event
   */
  const Event = {
    findById(eventList, id) {
      return _.find(eventList, function(e){
        return e.id === id;
      });
    }
  };

  /**
   * @module Event.DOM
   */
  Event.DOM = {
    /**
     * @method findById
     * @param {Integer} eventId id of event for finding event DOM node
     */
    findById(eventId) {
      return $('#event-' + eventId);
    },

    /**
     * @method getIdFromNode
     * @param {Node} node event node or child of event node
     * @returns {Integer} id of event
     */
    getIdFromNode(node) {
      return parseInt(
        $(node).closest('.event-display')
               .attr('id')
               .replace('event-', '')
      );
    },

    nextEventWithPhoto() {
      return $('.event-display--active').nextAll('.event-display[has-photo=true]').first();
    },

    prevEventWithPhoto() {
      return $('.event-display--active').prevAll('.event-display[has-photo=true]').first();
    },

    activateEvent(event) {
      Event.DOM.setHighlight(event.id);
      Event.DOM.scrollToHighlight();

      if(!event.imageSrc) { return; }

      Event.DOM.appendImageLoading(event.id);
      const img = Photo.load(event.imageSrc);

      img.onload = function() {
        Event.DOM.removeImageLoading(event.id);
        Event.DOM.appendImage(img, event.id);
      };
    },

    stepActiveEvent(direction) {
      const activeNode = Event.DOM[direction + 'EventWithPhoto']();
      if(!activeNode.length) { return; }

      const event = Event.findById(
        Event.list,
        Event.DOM.getIdFromNode(activeNode)
      );

      Event.DOM.activateEvent(event);
      Photo.DOM.displayFullscreen(event.fullImageSrc);
    },

    /**
     * @method setHighlight
     * @param {Integer} eventId id of event for finding event DOM node
     */
    setHighlight(eventId) {
      Event.DOM.clearHighlight();
      Event.DOM.findById(eventId)
               .addClass('event-display--active');
    },

    /**
     * @method clearHighlight
     */
    clearHighlight() {
      $('.event-display').removeClass('event-display--active');
    },

    /**
     * @method appendImage
     * @param {Object}  image Image object
     * @param {Integer} eventId id of event for finding event DOM node
     */
    appendImage(img, eventId) {
      const event = Event.DOM.findById(eventId);
      const image = $(img).hide();

      event.find('.image-drop-zone').html(image);
      image.fadeIn();
    },

    /**
     * @method appendImageLoading
     * @param {Integer} eventId id of event for finding event DOM node
     */
    appendImageLoading(eventId) {
      const markup = '<div class="event-display-image-loading">Loading photo...</div>';

      Event.DOM.findById(eventId)
               .find('.image-drop-zone')
               .html(markup);
    },

    removeImageLoading(eventId) {
      Event.DOM.findById(eventId)
               .find('.event-display-image-loading')
               .remove();
    },

    /**
     * @method removeImage
     * @param {Integer} eventId id of event for finding event DOM node
     */
    removeImage(eventId) {
      Event.DOM.findById(eventId)
               .find('.image-drop-zone').html('');
    },

    /**
     * @method scrollToHighlight
     */
    scrollToHighlight() {
      $('.event-display-list').scrollTo(
        $('.event-display--active'), 300, {
          offset: { top: -44 }
        }
      );
    }
  };


  $(function() {
    if(window.pageName != 'trips/show') { return; }
    MapLoadingSpinner.show();
  });

  // Window onload -------------------------------------------------------------

  $(window).on('load', function() {
    if(window.pageName != 'trips/show') { return; }

    const eventList = _.clone(window.events);
    Event.list = eventList;

    // car animation
    if($('.event-display-empty-state').length) {
      window.setTimeout(function() {
        $('.event-display-empty-state img').addClass('car-active');
      }, 300);
    }

    // hide fullscreen image
    $('body').on('click', '.full-image-container .image-close', function() {
      Photo.DOM.hideFullscreen();
    });

    // zoom in fullscreen image
    $('body').on('click', '.full-image-container .image-zoom-in', Photo.DOM.zoomIn);

    // zoom out fullscreen image
    $('body').on('click', '.full-image-container .image-zoom-out', Photo.DOM.zoomOut);

    $(document).keyup(function(e) {
      if (e.keyCode == 27) { Photo.DOM.hideFullscreen(); }
    });

    // display fullscreen image
    $('.event-display').on('click', '.image-drop-zone img', function() {
      const eventData = Event.findById(
        eventList,
        Event.DOM.getIdFromNode(this)
      );

      Photo.DOM.displayFullscreen(eventData.fullImageSrc);
    });

    /**
     * @method markerTapped
     * @param {Object} map Google Maps Map instance
     * @param {Object} marker Google Maps Marker instance
     * @param {Object} event event JSON
     * @param {Object} infoWindow Google Maps InfoWindow instance
     */
    const markerTapped = function(map, marker, event, infoWindow){
      map.setCenter(marker.getPosition());

      infoWindow.close();
      infoWindow.setContent(event.displayText);
      infoWindow.open(map, marker);

      Event.DOM.activateEvent(event);
    };

    /**
     * @method handleCloseEvent
     * @param {Object} InfoWindow Google Maps InfoWindow instance
     */
    const handleCloseEvent = function(infoWindow) {
      infoWindow.close();
      Event.DOM.clearHighlight();
      Event.DOM.removeImage(event.id);
    };

    // -- Create map

    const centerCoords = {
      lat: 37.773972,
      lng: -122.431297
    };

    if(eventList.length) {
      centerCoords.lat = eventList[0].latitude
      centerCoords.lng = eventList[0].longitude;
    }

    const map = new google.maps.Map(document.getElementById('map'), {
      center: centerCoords,
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      mapTypeControl: false
    });

    google.maps.event.addListenerOnce(map, 'idle', function(){
      mapLoaded = true;
      MapLoadingSpinner.hide();
    });

    // -- Draw path

    const path = new google.maps.Polyline({
      path: eventList.map(function(event) {
        return {
          lat: event.latitude,
          lng: event.longitude
        };
      }),
      geodesic: true,
      strokeColor: '#dd0000',
      strokeOpacity: 0.76,
      strokeWeight: 3
    });

    path.setMap(map);

    // -- Create infoWindow

    const infoWindow = new google.maps.InfoWindow({
      content: ''
    });

    // -- Create markers and clusterer

    const markers = _.map(eventList, function(event) {
      const marker = new google.maps.Marker({
        position: {
          lat: event.latitude,
          lng: event.longitude
        },
        title: event.displayText,
        map: map,
        animation: google.maps.Animation.DROP
      });

      marker.addListener('click', function() {
        markerTapped(map, marker, event, infoWindow);
      });

      event.marker = marker;

      return marker;
    });

    const markerCluster = new MarkerClusterer(map, markers, {
      imagePath: '/images/m',
      gridSize: 40,
      styles: [{
        url: '/images/pin.png',
        height: 48,
        width: 30,
        anchor: [-18, 0],
        textColor: '#ffffff',
        textSize: 14,
        iconAnchor: [15, 48]
      }]
    });

    $('.event-display').on('click', function(e) {
      if($(this).hasClass('event-display--active')) { return; }

      const id    = Event.DOM.getIdFromNode(this);
      const event = Event.findById(eventList, id);

      if(mapLoaded) {
        markerTapped(map, event.marker, event, infoWindow);
      } else {
        Event.DOM.activateEvent(event);
      }
    });

    $('.event-display .button-circle').on('click', function(e) {
      handleCloseEvent(infoWindow);
      Event.DOM.removeImage(Event.DOM.getIdFromNode(this));
      killDOMEvent(e);
    });

  }); // window.onload
})();
