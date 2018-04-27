window.addEventListener('load', () => {
  var input = document.getElementById('searchTextField');
  var autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    var place = autocomplete.getPlace();
    console.log(place);
    document.getElementById('address').value = place.formatted_address;
    document.getElementById('name').value = place.name;
    document.getElementById('vicinity').value = place.vicinity;
    document.getElementById('cityLat').value = place.geometry.location.lat();
    document.getElementById('cityLng').value = place.geometry.location.lng();
  });
});
