// JavaScript for disabling form submissions if there are invalid or empty fields
(function () {
  'use strict'
  // Select all the forms we want to apply this to.
  var forms = document.querySelectorAll('.validated-form')
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
          document.getElementById("noData").classList.remove("hidden");
        }
        form.classList.add('was-validated')
      }, false)
    })
})()

//Function to prevent file update button being pressed on editUser page when no file present. 
document.getElementById("picSubmit").onclick = function(e) {
  if (document.getElementById("profileImage").value == "") {
    e.preventDefault();
    document.getElementById("noData").classList.remove("hidden");
  }
}