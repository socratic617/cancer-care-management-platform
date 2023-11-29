var trash = document.getElementsByClassName("trash");
var favorite = document.getElementsByClassName("favorite")
var seeMore = document.querySelectorAll('[id^="dots-"]');//Credit ChatGPT

Array.from(favorite).forEach(function(element) {//arrray.from is a method that takes in something that looks like an array

    element.addEventListener('click', function(){

      fetch('/journals/updateFavorite', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: this.id, //this.id is the mongo db id for the journal 
          loggedInUserId: document.querySelector('#loggedInUserId').innerText//to get my mongo DB id for that user and this loggedInUserId is on the div
        })
      }).then(function (response) {
        window.location.reload()
      })
    });
});


console.log("trash elements : ", trash)

Array.from(trash).forEach(function(element) {

    element.addEventListener('click', function(){

      fetch('/journals/deleteJournal', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: this.id //this(button) is what got triggered
        })
      }).then(function (response) {
        window.location.reload()
      })
    });
});



// Credit: ChatGPT and https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_list ; https://stackoverflow.com/questions/69288281/javascript-card-search-filter-card-overview-page
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('simple-search');
    input.addEventListener('input', search);
})

function search(e){
  const inputValue = e.target.value.toUpperCase();

  //Get all <p></p> elements with journal description information
  const descriptions = document.querySelectorAll('[id^="journal-description-"]');

  //go through all of the elements
  for(let description of descriptions){

    //get the parent div aka card that holds the journal
    let card = document.querySelector('.card-'+ description.id.replace('journal-description-', ''));

    //check if the searched input exists, if not hide it
    if (description.innerText.toUpperCase().indexOf(inputValue) < 0) {
        card.style.display = "none"

      } else {
        card.style.display = ""

      }

  }

}

Array.from(seeMore).forEach(function(element) {//click on it 
  element.addEventListener('click', expandText);
});

//credit: https://www.w3schools.com/howto/howto_js_read_more.asp
function expandText(e) {

  let seeMoreSpan = document.querySelector('#more-'+ e.target.id.replace('dots-', ''));
  e.target.style.display = "none";
  seeMoreSpan.style.display = "inline";
}





