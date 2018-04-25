'use strict';

function main () {
  // -- utility functions

  function getUserLocation () {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          resolve(userPosition);
        }, () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  let marker = null;

  function addMarker (map, location, title) {
    const markerOptions = {
      position: location,
      title: title
    };
    marker = new google.maps.Marker(markerOptions);
    marker.setMap(map);
    return marker;
  }

  // -- build the map

  const ironhackBCN = {
    lat: 41.3977381,
    lng: 2.190471916
  };
  const container = document.getElementById('map');
  const options = {
    zoom: 15,
    center: ironhackBCN
  };
  const map = new google.maps.Map(container, options);

  getUserLocation()
    .then((userLocation) => {
      if (userLocation) {
        addMarker(map, userLocation, 'your location');
      }
    });

  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function (event) {
    if (marker) {
      marker.setMap(null);
    }

    const latitudeInput = document.getElementsByName('latitude')[0];
    const longitudeInput = document.getElementsByName('longitude')[0];

    latitudeInput.value = event.latLng.lat();
    longitudeInput.value = event.latLng.lng();

    console.log(event.latLng.lat(), event.latLng.lng());
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    addMarker(map, location, 'event location');
  });

  // const geocoder = new google.maps.Geocoder();

  // document.getElementById('submitLocation').addEventListener('click', function () {
  //   geocodeAddress(geocoder, map);
  // });

  // function geocodeAddress (geocoder, resultsMap) {
  //   let address = document.getElementById('location').value;

  //   geocoder.geocode({ 'address': address }, function (results, status) {
  //     if (status === 'OK') {
  //       resultsMap.setCenter(results[0].geometry.location);
  //       let marker = new google.maps.Marker({
  //         map: resultsMap,
  //         position: results[0].geometry.location
  //       });
  //       document.getElementById('latitude').value = results[0].geometry.location.lat();
  //       document.getElementById('longitude').value = results[0].geometry.location.lng();
  //     } else {
  //       console.log('Geocode was not successful for the following reason: ' + status);
  //     }
  //   });
  // }
}
window.addEventListener('load', main);
