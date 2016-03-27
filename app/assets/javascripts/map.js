window.findEventById = function(id) {
  return _.find(window.events, function(e){
    return e.id === id;
  });
};

window.markerTapped = function(map, marker, event){
  infoWindow.close();
  infoWindow.setContent(event.displayText);
  infoWindow.open(map, marker);
  window.clearHighlight();
  window.setHighlight(event.id);
  window.scrollToHighlight();
};

window.clearHighlight = function() {
  $('.event-display').removeClass('event-display--active');
};

window.setHighlight = function(eventId) {
  $('#event-' + eventId).addClass('event-display--active');
};

window.scrollToHighlight = function() {
  $('.display-view-list-section').scrollTo($('.event-display--active'), 300);
};

window.onload = function() {

  // -- Create map

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 36.9471936,
      lng: -88.58287,
    },
    zoom: 5
  });

  // -- Draw path

  var path = new google.maps.Polyline({
    path: window.events.map(function(event) {
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

  window.infoWindow = infoWindow;

  // -- Place markers

  var delay = 0;
  window.events.forEach(function(event) {
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
        window.markerTapped(map, marker, event);
      });

      event.marker = marker;
    }, delay);

    delay = delay + 100;
  });

  $('.event-display').on('click', function(e) {
    var id = parseInt(
      $(this).attr('id').replace('event-', '')
    );

    var event = window.findEventById(id);

    window.markerTapped(map, event.marker, event);
  });

};
