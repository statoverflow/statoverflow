// Front end JS
'use strict';


/************** NEEDED TERMINAL ENV VARIABLES *****************/
////////////////////// MAC //////////////////////
//export PORT=3000
//export CLIENT_URL=http://localhost:8080
//export DATABASE_URL=postgres://localhost:5432/books_app

////////////////////// LINUX //////////////////////
// export PORT=3000
// export CLIENT_URL='http://localhost:8080'
// export DATABASE_URL='postgres://postgres:password@localhost:5432/books_app'

let __API_URL__ = 'http://localhost:3000'; // API URL

$('#search_form').on('submit', function (e) {
  e.preventDefault();
  let selectLang = $('#search_form select[name="selected_language"]').val();
  let numOfKeywords = $('#search_form input[name="search_criteria"]').val().split(' ').length;
  let searchKeywords = $('#search_form input[name="search_criteria"]').val().split(' ').join(';');
  let qtnType = $('input[name="search_type"]:checked', '#search_form').val();
  let dateRange = $('select[name="search_type_range"]', '#search_form').val();
  let numOfResults = parseInt($('select[name="search_type_numresults"]', '#search_form').val());
  let sortBy = $('select[name="search_type_sort"]', '#search_form').val();


  if (numOfKeywords > 4){
    return; // TODO: TELL THE USER TO USE 4 OR LESS KEYWORDS
  }

  if (qtnType === 'popular') {
    //Popular AJAX call
    $.ajax({
        url: `${__API_URL__}/api/v1/questions/`,
        method: 'GET',
        data: {
          tags: `${searchKeywords};${selectLang}`,
          pagesize: `${numOfResults}`,
          sort: `${sortBy}`
        }
      })
      .done(function (data) {
        console.log('I recieved something', data);
        $('#results_section').empty();
        data.forEach(questionObj => {
          let answered = questionObj.is_answered ? "✓ Answered" : "✗ Unanswered"

          let newQuestion = `
          <div class="result">
            <img class="result_img" src="${questionObj.user_image}" alt="profile pic"/>
            <div class="result_inner_container">
              <a href="${questionObj.link}"><h2>${questionObj.title}</h2></a>
              <p class="result_user"><a href="${questionObj.user_link}">${questionObj.user}</a></p>
              <p class="result_answered"><span>Status: </span><span>${answered}</span></p>
            </div>
            <span class="result_date">${new Date(questionObj.creation_date*1000).toDateString()}</span>
          </div>
          `

          $('#results_section').append(newQuestion);
          })
        })
  } else {
    //Unanswered AJAX call
    $.ajax({
        url: `${__API_URL__}/api/v1/unanswered-questions/`,
        method: 'GET',
        data: {
          tags: `${searchKeywords};${selectLang}`,
          pagesize: `${numOfResults}`,
          sort: `${sortBy}`
        }
      })
      .done(function (data) {
        console.log('I recieved something', data);
        $('#results_section').empty();
        data.forEach(questionObj => {
          let answered = questionObj.is_answered ? "✓ Answered" : "✗ Unanswered"

          let newQuestion = `
          <div class="result">
            <img class="result_img" src="${questionObj.user_image}" alt="profile pic"/>
            <div class="result_inner_container">
              <a href="${questionObj.link}"><h2>${questionObj.title}</h2></a>
              <p class="result_user"><a href="${questionObj.user_link}">${questionObj.user}</a></p>
              <p class="result_answered"><span>Status: </span><span>${answered}</span></p>
            </div>
            <span class="result_date">${new Date(questionObj.creation_date*1000).toDateString()}</span>
          </div>
          `

          $('#results_section').append(newQuestion);
          })
        })

  }




  })


  // let language = document.querySelector('#selected_language').value;
  // let sort = document.querySelector('#selected_sort').value;
//   let sort = 'reputation';
//   console.log(`language: ${language}, location: ${location}`);
//   $.ajax({
//     url: `${__API_URL__}/api/v1/top-users/`,
//     method: 'GET',
//     data: {
//       location: location,
//       language: language,
//       sort: sort
//     }
//   }).done(function (data) {
//     console.log('I recieved something', data);
//     let thead = `
//     <thead>
//       <tr>
//         <th>Ranking</th>
//         <th>Name</th>
//         <th>Reputation</th>
//         <th>Top Answer Rate</th>
//         <th>Location</th>
//       </tr>
//     </thead>
//     `;
//     $('#resultTable').empty().append(thead);
//     locations = [];
//     data.forEach((x, i) => {
//       let tr =
//         `<tr>
//           <td>${i + 1}</td>
//           <td>${x.user}</td>
//           <td>${x.reputation}</td>
//           <td>${x.accept_rate}</td>
//           <td>${x.location}</td>
//         </tr>
//         `
//       $('#resultTable').append(tr);
//       if (x.location!=="no user location") geocodeAddress(x.location);
//     })
//     // $('#resultTable').html(data);
//   }).fail(function (xhr, status, error) {
//     console.error(error, xhr);
//   });
// });
// function geocodeAddress(address1) {
//   $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address1 + '&key=AIzaSyAAHNPc_aDQ81b4sL2oLFa79vHn4LJ-s1w', function (data) {
//     locations.push([address1, data['results'][0]['geometry']['location']['lat'], data['results'][0]['geometry']['location']['lng']]);
//     mapRender();
//   })
// }
