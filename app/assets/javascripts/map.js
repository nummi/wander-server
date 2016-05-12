/**
 * @method loadImage
 * @param {String} src url to image source
 * @returns {Object} Image object
 */
var loadImage = function(src) {
  var img = new Image();
  img.src = src;
  return img;
};

/**
 * @param {Event} e
 */
var killDOMEvent = function(e) {
  e.preventDefault();
  e.stopPropagation();
};


/**
 * @module Event
 */
var Event = {
  findById: function(eventList, id) {
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
  findById: function(eventId) {
    return $('#event-' + eventId);
  },

  /**
   * @method getIdFromNode
   * @param {Node} node event node or child of event node
   * @returns {Integer} id of event
   */
  getIdFromNode(node) {
    return parseInt(
      $(node).closest('.event-display').attr('id').replace('event-', '')
    );
  },

  /**
   * @method setHighlight
   * @param {Integer} eventId id of event for finding event DOM node
   */
  setHighlight: function(eventId) {
    Event.DOM.clearHighlight();
    Event.DOM.findById(eventId)
             .addClass('event-display--active');
  },

  /**
   * @method clearHighlight
   */
  clearHighlight: function() {
    $('.event-display').removeClass('event-display--active');
  },

  /**
   * @method appendImage
   * @param {Object}  image Image object
   * @param {Integer} eventId id of event for finding event DOM node
   */
  appendImage: function(img, eventId) {
    var event = Event.DOM.findById(eventId);
    var image = $(img).hide();
    var dropZone = event.find('.image-drop-zone').html(image);
    image.fadeIn();
  },

  /**
   * @method removeImage
   * @param {Integer} eventId id of event for finding event DOM node
   */
  removeImage: function(eventId) {
    Event.DOM.findById(eventId)
             .find('.image-drop-zone').html('');
  },

  /**
   * @method scrollToHighlight
   */
  scrollToHighlight: function() {
    $('.display-view-list-section').scrollTo($('.event-display--active'), 300);
  }
};

$(window).on('load', function() {

  // car animation
  if($('.event-display-empty-state').length) {
    window.setTimeout(function() {
      $('.event-display-empty-state img').addClass('car-active');
    }, 300);
  }

  var eventList = _.clone(window.events);

  /**
   * @method markerTapped
   * @param {Object} map Google Maps Map instance
   * @param {Object} marker Google Maps Marker instance
   * @param {Object} event event JSON
   * @param {Object} infoWindow Google Maps InfoWindow instance
   */
  var markerTapped = function(map, marker, event, infoWindow){
    map.setCenter(marker.getPosition());

    infoWindow.close();
    infoWindow.setContent(event.displayText);
    infoWindow.open(map, marker);

    Event.DOM.setHighlight(event.id);
    Event.DOM.scrollToHighlight();

    if(event && event.imageSrc) {
      var img = loadImage(event.imageSrc);
      img.onload = function() {
        Event.DOM.appendImage(img, event.id);
      };
    }
  };

  /**
   * @method handleCloseEvent
   * @param {String} src url to image source
   * @returns {Object} Image object
   */
  var handleCloseEvent = function(infoWindow) {
    infoWindow.close();
    Event.DOM.clearHighlight();
    Event.DOM.removeImage(event.id);
  };

  // -- Create map

  var centerCoords = {
    lat: 41.681961,
    lng: -81.2821347
  };

  if(eventList.length) {
    centerCoords.lat = eventList[0].latitude;
    centerCoords.lng = eventList[0].longitude;
  }

  var map = new google.maps.Map(document.getElementById('map'), {
    center: centerCoords,
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapTypeControl: false
  });

  // -- Draw path

  var path = new google.maps.Polyline({
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

  var infoWindow = new google.maps.InfoWindow({
    content: ''
  });

  // -- Place markers

  var delay = 0;
  eventList.forEach(function(event) {
    window.setTimeout(function() {
      var marker = new google.maps.Marker({
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
    }, delay);

    delay = delay + 100;
  });

  $('.event-display').on('click', function(e) {
    if($(this).hasClass('event-display--active')) { return; }

    var id    = Event.DOM.getIdFromNode(this);
    var event = Event.findById(eventList, id);

    markerTapped(map, event.marker, event, infoWindow);
  });

  $('.event-display .close-circle').on('click', function(e) {
    handleCloseEvent(infoWindow);
    Event.DOM.removeImage(Event.DOM.getIdFromNode(this));
    killDOMEvent(e);
  });

}); // window.onload
