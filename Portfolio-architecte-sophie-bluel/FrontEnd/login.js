

const myForm = document.getElementById('myForm');
const baliseEmail = document.getElementById('email');
const baliseMotdepass = document.getElementById('pass');
const myError = document.getElementById('error');

//Fonction de validation (1. check 2. login)

function validationUser() {
    const regExpmail = "[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+"
    const regMdp = "^[A-Za-z0-9]{5,}$"
    if(!regExpmail === baliseEmail.value) {
        myError.innerHTML = "Le mail est incorrect"
        myError.style.color = 'red'
        return false
    }
    if(!regMdp === baliseMotdepass.value){
        myError.innerHTML = "Le mot de passe est incorrect"
        myError.style.color = 'red'
        return false
    }
}

myForm.addEventListener("submit", function(e) {
    if(baliseMotdepass.value.trim() === ""){
        myError.innerHTML = "Le mot de passe est incorrect"
        myError.style.color = 'red'
        e.preventDefault()
    }
    if(baliseEmail.value.trim() === ""){
        myError.innerHTML = "Le mail est incorrect"
        myError.style.color = 'red'
        e.preventDefault()
    }
    validationUser(baliseEmail)
    validationUser(baliseMotdepass)
})


//Login (fectch + recup token (Try/catch = fail))

myForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let form = {baliseEmail,baliseMotdepass}
    fetch("http://localhost:5678/api/users/login/", {
        method:'POST',
        headers: {Accept : "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: form.baliseEmail.value,
            password: form.baliseMotdepass.value,
        }),
    }).then((response) => {
        if(response.status !== 200){
            alert("Le mail ou le mot de passe est incorrect !")
        }else {
        response.json().then((data) => {
            //STORE TOKEN
            sessionStorage.setItem("token", data.token)
            window.location.href="index.html"
            })
        }
    })
})

