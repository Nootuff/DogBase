//Header menu dropdown onClick
function menuDrop() {
    document.getElementById("dropdownMenu").classList.toggle("dropped");
  }

/*
  function tesr(){
    document.getElementById("dropdownMenu").classList.toggle("dropped");
  }
 */

  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) { 
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('dropped')) {
          openDropdown.classList.remove('dropped');
        }
      }
    }
  }
  

 