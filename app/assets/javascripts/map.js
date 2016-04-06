$(window).on('load', function() {

  // car animation
  if($('.event-display-empty-state').length) {
    window.setTimeout(function() {
      $('.event-display-empty-state img').addClass('car-active');
    }, 300);
  }

  var eventList = _.clone(window.events);

  var findEventById = function(id) {
    return _.find(eventList, function(e){
      return e.id === id;
    });
  };

  var markerTapped = function(map, marker, event, infoWindow){
    infoWindow.close();
    infoWindow.setContent(event.displayText);
    infoWindow.open(map, marker);
    map.setCenter(marker.getPosition());
    clearHighlight();
    setHighlight(event.id);
    scrollToHighlight();
  };

  var closeEvent = function(infoWindow) {
    infoWindow.close();
    clearHighlight();
  };

  var clearHighlight = function() {
    $('.event-display').removeClass('event-display--active');
  };

  var setHighlight = function(eventId) {
    $('#event-' + eventId).addClass('event-display--active');
  };

  var scrollToHighlight = function() {
    $('.display-view-list-section').scrollTo($('.event-display--active'), 300);
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
    if($(this).hasClass('event-display--active')) {
      return;
    }

    var id = parseInt(
      $(this).attr('id').replace('event-', '')
    );

    var event = findEventById(id);

    markerTapped(map, event.marker, event, infoWindow);
  });

  $('.event-display .close-circle').on('click', function(e) {
    closeEvent(infoWindow);
    e.preventDefault();
    e.stopPropagation();
  });

}); // window.onload
