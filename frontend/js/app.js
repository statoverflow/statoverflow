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

// let __API_URL__ = 'http://localhost:3000'; // API URL
let __API_URL__ = 'https://statoverflow.herokuapp.com'; // API URL (LIVE URL)


// adds the form input to local storage
let addToStorage = function (inputName, inputValue) {
  localStorage[`${inputName}`] = `${inputValue}`;
}

// replace the current fillFormFromStorage with this:
let takeFromStorage = function (inputName, inputValue) {
  if (localStorage[`${inputName}`]) inputValue = localStorage[`${inputName}`];
}

// new code
let fillFormFromStorage = () => {
  //takeFromStorage ('selected_language', $('#search_form select[name="selected_language"]').val());
  // $('#search_form select[name="selected_language"]').val(takeFromStorage ('selected_language', $('#search_form select[name="selected_language"]')));
  if (localStorage.selected_language) {
    $('#search_form select[name="selected_language"]').val(localStorage.getItem('selected_language'))
    $('#'+ localStorage.search_type).prop('checked', true);

    $('#search_form select[name="selected_criteria"]').val(localStorage.getItem('selected_criteria'))
    $('#search_form select[name="selected_criteria"]').val(localStorage.getItem('selected_criteria'))

    // takeFromStorage ('search_type', $('input[name="search_type"]:checked', '#search_form').val());
    $('#search_form select[name="search_type_numresults"]').val(localStorage.getItem('search_type_numresults'))
    $('#search_form select[name="search_type_sort"]').val(localStorage.getItem('search_type_sort'))
  }
}

// still run fillFormFromStorage at page load

// adds data from every form involved in the search form to local storage
let retainSearches = () => {
  addToStorage ('selected_language', $('#search_form select[name="selected_language"]').val());
  addToStorage ('search_criteria', $('#search_form input[name="search_criteria"]').val());
  addToStorage ('search_type', $('input[name="search_type"]:checked', '#search_form').val());
  addToStorage ('search_type_range', $('select[name="search_type_range"]', '#search_form').val());
  addToStorage ('search_type_numresults', $('select[name="search_type_numresults"]', '#search_form').val());
  addToStorage ('search_type_sort', $('select[name="search_type_sort"]', '#search_form').val());
}

// TODO run at page load:
fillFormFromStorage();
questionQuery();

$('#search_form').on('change', function (e) {
  e.preventDefault();
  // TODO run inside button submission
  retainSearches();
  console.log('search form event listener')
  questionQuery();
});

function questionQuery() {
  console.log('question query function')
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
            <a href="${questionObj.user_link}" target="_blank">
              <img class="result_img" src="${questionObj.user_image}" alt="profile pic"/>
            </a>
            <div class="result_inner_container">
              <a href="${questionObj.link}" target="_blank"><h2>${questionObj.title}</h2></a>
              <p class="result_user"><a href="${questionObj.user_link}" target="_blank">${questionObj.user}</a></p>
              <p class="result_answered"><span>Status: </span><span>${answered}</span></p>
            </div>
            <span class="result_date">${new Date(questionObj.creation_date*1000).toDateString()}</span>
          </div>
          `

          $('#results_section').append(newQuestion);
          })
        })
        .fail(console.log('failed AJAX request'));
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
        .fail(console.log('failed AJAX request'));

  }
}
