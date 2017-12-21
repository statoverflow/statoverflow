// event listener to monitor language menu & time frame menu. Send as header info to our API Endpoint.
// take response and populate it into our table
let __API_URL__ = 'https://statoverflow.herokuapp.com/';
document.querySelector('#options_form_container').addEventListener('change', function (e) {
  populateAllUsers();
});

function populateAllUsers(){
  let time = document.querySelector('#selected_time').value;
  let lang = document.querySelector('#selected_language').value;
  // let sort = document.querySelector('#selected_sort').value;
  let sort = 'reputation';
  console.log(`language: ${lang}, time: ${time}`);
  $.ajax({
    url: `${__API_URL__}/api/v1/top-users/`,
    method: 'GET',
    data: {
      time: time,
      lang: lang
    }
  }).done(function (data) {
    console.log('I recieved something', data);
    let thead = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Score</th>
        <th>Reputation</th>
        <th>Post Count</th>
        <th>Accept Rate</th>
      </tr>
    </thead>
    `;
    $('#resultTable').empty().append(thead);
    locations = [];
    data.forEach((x, i) => {
      let tr =
        `<tr>
          <td><span class='count'>${i + 1}</span><a href='${x.link}' target='_blank'>${x.user}</a></td>
          <td>${x.score}</td>
          <td>${x.reputation}</td>
          <td>${x.post_count}</td>
          <td>${x.accept_rate}</td>
        </tr>
        `
      $('#resultTable').append(tr);
    })
    // $('#resultTable').html(data);
  }).fail(function (xhr, status, error) {
    console.error(error, xhr);
  });
}

populateAllUsers();
