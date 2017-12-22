// START MODAL CODE
let element = document.createElement('div');
element.setAttribute('id','aboutUs');

document.querySelector('.aboutUsLink').addEventListener('click', function(e){  
  element.innerHTML = `
  <div class="aboutInner">
    <div class="closeButton">X</div>
    <img src="images/logo.svg" class="aboutImg" />
    <h2>Why?</h2>
    <div>
    Statoverflow was built to display our teams knowledge of API based calls using a very well thought out and designed API from stack overflow. We built the API thinking of how users can better their skills as a coder and who they can look up to in order to do so from stack overflow based on what language they are looking to learn.
    </div>
    <h2>Who Are We?</h2>
    <div>
    Who are we? We are a team of three aspiring developers studying Web Development best practices at CodeFellows. </div>
    <div id="whoWeAre">
        <a href="https://github.com/gricha2380" target="_blank">Gregor</a>
        <a href="https://github.com/jpjazzy" target="_blank">Jeremy</a>
        <a href="https://github.com/Jordanwvn" target="_blank">Jordan</a>
    </div>
  </div>
  <a href="https://github.com/statoverflow"><div class="icon-github"></div></a>

  `;
  document.querySelector('main').append(element);
  document.querySelector('.closeButton').addEventListener('click', function(e){
    element.remove();
  });
});
// END MODAL CODE