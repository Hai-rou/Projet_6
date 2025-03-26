
const ApiUrl = "http://localhost:5678/api/"
let worksData;
let categories;

let filter;
let gallery;

/****Recupération des travaux depuis le back end***/
window.onload = () =>{
    fetch(`${ApiUrl}works`)
    .then((response) => response.json())
    .then((data) => {
        worksData = data;
        console.log(data)
        /**Récupération des travaux***/
        listOfcategories();
        
        modalDataGallery(worksData)

        dataGallery(worksData);
        /***Filtre***/
        filter = document.querySelector(".filter");
        dataFilter(categories, filter)
        /*****Get list of category***/
        
    })
}

/***Gallery****/
function dataGallery(data) {
    gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
     
data.forEach((i) => {
    
    const workCard = document.createElement("figure");
    const workImage = document.createElement("img");
    const workTitle = document.createElement("figcaption");
    workImage.src = i.imageUrl;
    workImage.alt = i.title;
    workTitle.innerText = i.title;
    //Warning modal test
   
    ////
    workCard.dataset.category = i.category.name;
    workCard.className = "workCard";
    
    gallery.appendChild(workCard);
    workCard.append(workImage, workTitle);

  });
}

/****Filtre***/

/****Get array category (A MODIFIER)**/
function listOfcategories() {
    let listOfcategories = new Set();
    worksData.forEach((work) => {
        listOfcategories.add(JSON.stringify(work.category))
    })

    const arrayofStrings = [...listOfcategories];

    categories = arrayofStrings.map((s) => JSON.parse(s));
    console.log(categories)
}
//Init buttons
function dataFilter(categories, filter){
    const button =document.createElement("button");
    button.innerText = "Tous";
    button.className = "btn";
    button.dataset.category = "Tous";
    filter.appendChild(button);
    filterBtn(categories, filter);
    functionFilter();
}


/****Create button***/
function filterBtn(categories, filter) {
    categories.forEach((categorie) => {
        createbtnfilter(categorie, filter)
    })
}

function createbtnfilter(categorie, filter) {
    const button = document.createElement("button");
    button.innerText = categorie.name;
    button.className = "btn"; 
    button.dataset.category = categorie.name; 
    filter.appendChild(button)
}

// Filter
function functionFilter() {
    const filterbuttons = document.querySelectorAll(".btn");
    filterbuttons.forEach((i) => {
        i.addEventListener("click", function () {
            toggleProjects(i.dataset.category);
        });
    });
}
// 
function toggleProjects(datasetCategory) {
    const figures = document.querySelectorAll(".workCard");
    if ("Tous" === datasetCategory) {
        figures.forEach((figure) => {
            figure.style.display = "block";
        });
    } else {
        figures.forEach((figure) => {
            figure.dataset.category === datasetCategory
            ? (figure.style.display = "block")
            : (figure.style.display = "none");
        });
    }
}

//******************************ADMIN MODE******************************************/

function isAdmin() {
    console.log("Fonction isAdmin appelée")
    const token = sessionStorage.getItem("token")
    
    if(token && token.length === 143) {
        const filterElement = document.querySelector(".filter")
        const logLinkElement = document.getElementById("logLink")

        if(filterElement){
        filterElement.style.display = "none"
        }
         if(logLinkElement){
        logLinkElement.innerText = "Logout"
        }

        const parentElement = document.querySelector("body")
        const topMenu = document.createElement("div")
        const editMode = document.createElement("p")

        topMenu.className = "topMenu"

        editMode.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>Mode édition'

        if(parentElement){
            parentElement.insertAdjacentElement("afterbegin", topMenu)
        }
        if(topMenu){
            topMenu.append(editMode)
        }

        const btnEtid = `<p class="btnEtid"><i class="fa-solid fa-pen-to-square"></i>Mode édition</p>`
        document.querySelector("#portfolio h2").insertAdjacentHTML("afterend", btnEtid)

        //Event listener moddal
        document.querySelector("#portfolio p").addEventListener("click", openModal)
   }
}

isAdmin()

//*************Delete token when logout**************/

document.getElementById("logLink").addEventListener("click", (e) => {
    e.preventDefault()
    sessionStorage.removeItem("token")
    window.location.href="login.html"
})

//*******************MODAL *********************/

function openModal(){
    document.querySelector('.overlay').style.display = 'block'
    document.querySelector('.modal').style.display = 'block'
}

function modalDataGallery(data){
    modalGallery = document.querySelector('.modal_gallery')
    modalGallery.innerHTML = ""

    data.forEach((i) => {
        const modalImg = document.createElement("img")

        modalImg.src = i.imageUrl;
        modalImg.alt = i.title;

        modalGallery.appendChild(modalImg);
    })
}