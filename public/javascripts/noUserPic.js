//Function to prevent file update button being pressed on editUser page when no file present. 
document.getElementById("picSubmit").onclick = function(e) {
    if (document.getElementById("profileImage").value == "") {
      e.preventDefault();
      document.getElementById("noData").classList.remove("hidden");
    }
  }