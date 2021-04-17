//Validation for password input on register page.
const newPass = document.getElementsByClassName('newPass')
const firstPass = document.getElementById("firstPass");
const matchPass = document.getElementById("matchPass");
const letter = document.getElementById("letter");
const capital = document.getElementById("capital");
const number = document.getElementById("number");
const length = document.getElementById("length");
const match = document.getElementById("match");

// When the user clicks on the password fields, show the message box
for (var i=0; i < newPass.length; i++) {
  newPass[i].onfocus = function() {
    document.getElementById("message").style.display = "block";
  }
}

//When user clicks away from passwrod fields hide the message box
for (var i=0; i < newPass.length; i++) {
  newPass[i].onblur = function() {
    document.getElementById("message").style.display = "none";
  }
}

// When the user starts to type something inside the password field
firstPass.onkeyup = function() {
  // Validate lowercase letters
  const lowerCaseLetters = /[a-z]/g;
  if(firstPass.value.match(lowerCaseLetters)) {  
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }
  
  // Validate capital letters
  const upperCaseLetters = /[A-Z]/g;
  if(firstPass.value.match(upperCaseLetters)) {  
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  const numbers = /[0-9]/g;
  if(firstPass.value.match(numbers)) {  
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }
  
  // Validate length
  if(firstPass.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}

//Check passwords match
matchPass.onkeyup = function() {
 if(matchPass.value == firstPass.value ) {
  match.classList.remove("invalid");
  match.classList.add("valid");
} else {
  match.classList.remove("valid");
  match.classList.add("invalid");
}
}

/*
//Prevent submission if they don't.
function checkMatch() {
  if (firstPass.value != matchPass.value) {
      alert("Passwords do not match.");
      location.reload();
      return false;
  }
  return true;
}
*/