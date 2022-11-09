var trash = document.getElementsByClassName("fa-trash-o");

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const comp = this.parentNode.parentNode.childNodes[1].childNodes.innerText
        const dte = this.parentNode.parentNode.childNodes[2].childNodes.innerText
        const amt = this.parentNode.parentNode.childNodes[3].childNodes.innerText
        fetch('billList', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'comp': comp,
            'dte': dte,
            'amt': amt
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
