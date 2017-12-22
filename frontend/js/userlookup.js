'use strict';

$( document ).ready(function() {

// globals
let __API_URL__ = 'http://localhost:3000';

let locations = [''];
// let locations = ['Bondi Beach', -33.890542, 151.274856, 4];

  // event listener for user search
  document.querySelector('#search_user_button').addEventListener('click', function (e) {
    e.preventDefault();
    if (document.querySelector('#search_user').value !=='') {
      searchUsers();
    }
  });

//ajax call for user search
function searchUsers(){
  let username = document.querySelector('#search_user').value;
  $.ajax({
    url: `${__API_URL__}/api/v1/user/`,
    method: 'GET',
    data: {
      search: username
    }
  }).done(function (data) {
    $('#user_search_result').empty();
    data.forEach((x, i) => {
      let box =
        `
          <div class="user_search_result">
              <span class='count'>${i + 1}</span>
              <img class="user_search_img" src="${x.user_image}" />
              <div class="user_search_container1">
                <h2 class="user_search_username"><a href="${x.link}">${x.user}</a></h2>
                <p class="user_search_rep">Reputation: ${x.reputation}</p>
              </div>
              <div class="user_search_container2">
                <p class="user_search_date_reg">Date registered: ${new Date(x.creation_date*1000).toDateString()}</p>
                <p class="user_search_date_accessed">Last Accessed: ${new Date(x.last_access_date*1000).toDateString()}</p>
                <p class="user_search_date_accessed">Location: ${x.location}</p>
              </div>
            </div>
        </div>
        `
      $('#user_search_result').append(box);

      if (x.location !== 'no user location') geocodeAddress(x.location);
    })
    locations = [];
  }).fail(function (xhr, status, error) {
    console.error(error, xhr);
  });

}
searchUsers();

// get lat long from text addresses
function geocodeAddress(address1) {
  $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address1 + '&key=AIzaSyAAHNPc_aDQ81b4sL2oLFa79vHn4LJ-s1w').done(function(data){
    locations.push([address1, data['results'][0]['geometry']['location']['lat'], data['results'][0]['geometry']['location']['lng']]);
    mapRender();
  })
}

// map render
function mapRender() {
  // console.log('map render now...', locations)
  let bound = new google.maps.LatLngBounds();
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: new google.maps.LatLng(0, 0),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  // map.fitBounds(bound);
  // map.panToBounds(bound);
  var infowindow = new google.maps.InfoWindow();
  var marker, i;
  for (i = 0; i < locations.length; i++) {
    console.log('now mapping XY with for loop', locations)
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map
    });
  }
  google.maps.event.addListener(marker, 'click', (function (marker, i) {
    return function () {
      infowindow.setContent(locations[i][0]);
      infowindow.open(map, marker);
    }
  })(marker, i));
} //end map marker
mapRender();

}); // document ready
