var trash = document.getElementsByClassName("fa-trash-o");
let txtEdit = document.getElementsByClassName("material-symbols-outlined")

//complete this function to update in the database, needs a fetch, 
//data attribute id, connect to put/update********
  Array.from(txtEdit).forEach(function(element) {
        element.addEventListener('click', (e) => {
          e.preventDefault()
          const amountInput = e.target.parentNode.childNodes[0]
          console.log(e.target.parentNode.childNodes[0])
          amountInput.focus()
          amountInput.addEventListener('keyup', txtEdt)
        })
      })

      function txtEdt(e){
        let updateTxt = e.target.value
        console.log(updateTxt)
        const _id = e.target.parentNode.childNodes[3].value.trim()
  console.log(_id)
  fetch('edit', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                updateTxt, _id
              })
            })
            .then(response => {
              if (response.ok) return response.json()
            })
            .then(data => {
              console.log(data)
              //window.location.reload(true)
            })
}
      

      




// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const id = this.parentNode.parentNode.childNodes[5].value
//         console.log(this.parentNode.parentNode.childNodes[5].value)
//         fetch('billList', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'id': id
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const id = this.parentNode.childNodes[3].value
    console.log(this.parentNode.childNodes[3].value)
    fetch('billList', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'id': id
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
