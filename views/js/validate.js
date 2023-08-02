const form = document.querySelector("form");
const name = document.querySelector("input[type = Logintext]");
const password = document.querySelector("input[type = password]");

form.addEventListener("submit" , onFormSubmit);

function onFormSubmit(e){
    if (name.value === "" || password.value === "") {
        e.preventDefault();
        alert("please fill the form");
        return false;
    }
}

