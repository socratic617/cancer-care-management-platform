var trash = document.getElementsByClassName("trash");

Array.from(trash).forEach(function (element) {

  element.addEventListener('click', function () {

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