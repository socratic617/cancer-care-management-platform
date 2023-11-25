var trash = document.getElementsByClassName("trash");
var favorite = document.getElementsByClassName("favorite")
var seeMore = document.querySelectorAll('[id^="dots-"]');//Credit ChatGPT

Array.from(favorite).forEach(function(element) {
  console.log("adding favorite listener too : ", element);

    element.addEventListener('click', function(){
      console.log('FAVORITE UPDATE : ')
      console.log("this.id : " , this.id )
      console.log("before my fetch loggedInUserId :")
      console.log( document.querySelector('#loggedInUserId'))
      fetch('/journals/updateFavorite', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: this.id, //this(button) is what got triggered
          loggedInUserId: document.querySelector('#loggedInUserId').innerText
        })
      }).then(function (response) {
        window.location.reload()
      })
    });
});


console.log("trash elements : ", trash)

Array.from(trash).forEach(function(element) {
  console.log("adding delete listner too : ", element);

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

  console.log('descriptions')
  console.log(descriptions)

  //go through all of the elements
  for(let description of descriptions){

    //get the parent div aka card that holds the journal
    let card = document.querySelector('.card-'+ description.id.replace('journal-description-', ''));

    //check if the searched input exists, if not hide it
    if (description.innerText.toUpperCase().indexOf(inputValue) < 0) {
        card.style.display = "none"
        console.log("found a match")
        console.log(card)
      } else {
        card.style.display = ""
        console.log("does not match")
      }

  }

}

Array.from(seeMore).forEach(function(element) {
  console.log("adding delete listner too : ", element);

    element.addEventListener('click', expandText);
});

//credit: https://www.w3schools.com/howto/howto_js_read_more.asp
function expandText(e) {

  let seeMoreSpan = document.querySelector('#more-'+ e.target.id.replace('dots-', ''));
  e.target.style.display = "none";
  seeMoreSpan.style.display = "inline";
}





