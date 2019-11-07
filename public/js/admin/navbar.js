var dropdown = (document.getElementsByClassName("dropdown_menu"))[0];
var caret = document.getElementById("admin_webcontent_caret");
var i;

var content = document.getElementsByClassName("dropdown_container");
console.log(content[0]);

dropdown.addEventListener("click", function () {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
        caret.className = "fa fa-caret-down";
    } else {
        dropdownContent.style.display = "block";
        caret.className = "fa fa-caret-up";
    }
});