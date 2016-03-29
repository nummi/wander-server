window.onload = function() {

  const eventList = _.clone(window.events);

  const findEventById = function(id) {
    return _.find(eventList, function(e){
      return e.id === id;
    });
  };

  const markerTapped = function(map, marker, event, infoWindow){
    infoWindow.close();
    infoWindow.setContent(event.displayText);
    infoWindow.open(map, marker);
    clearHighlight();
    setHighlight(event.id);
    scrollToHighlight();
  };

  const closeEvent = function(infoWindow) {
    infoWindow.close();
    clearHighlight();
  };

  const clearHighlight = function() {
    $('.event-display').removeClass('event-display--active');
  };

  const setHighlight = function(eventId) {
    $('#event-' + eventId).addClass('event-display--active');
  };

  const scrollToHighlight = function() {
    $('.display-view-list-section').scrollTo($('.event-display--active'), 300);
  };

  // -- Create map

  const map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: eventList[0].latitude,
      lng: eventList[0].longitude,
    },
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapTypeControl: false
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

  // -- Place markers

  let delay = 0;
  eventList.forEach(function(event) {
    window.setTimeout(function() {
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
    }, delay);

    delay = delay + 100;
  });

  $('.event-display').on('click', function(e) {
    if($(this).hasClass('event-display--active')) {
      if(!$(e.target).hasClass('event-display-small-image')) {
        closeEvent(infoWindow);
      }
      return;
    }

    const id = parseInt(
      $(this).attr('id').replace('event-', '')
    );

    const event = findEventById(id);

    markerTapped(map, event.marker, event, infoWindow);
  });

}; // window.onload
