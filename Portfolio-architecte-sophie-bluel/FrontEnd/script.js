
const ApiUrl = "http://localhost:5678/api/"
let worksData;
let categories;

let filter;
let gallery;


/***Overlay */
const overlay = document.querySelector('.overlay')
/**Modal 1 items*/
const modal1 = document.querySelector('.modal')
const modalClose = document.querySelector(".modal_close")
/***Modal 2 items */
const modal2 = document.querySelector('#modal2')
const btnadd = document.querySelector('#btnadd')
const backBtn = document.querySelector('#return')
const modalCloseTwo = document.querySelector("#closeTwo")

const previewimg = document.querySelector('#previewPictImg')
const btnModal1 = document.querySelector(".modal_btn_add_pict")

const previewPict = document.querySelector('#previewPict')
const fileInput = document.querySelector('#photo');


/****Recupération des travaux depuis le back end***/
window.onload = () =>{
    fetch(`${ApiUrl}works`)
    .then((response) => response.json())
    .then((data) => {
        worksData = data;
        console.log(data)
        /**Récupération des travaux***/
        listOfcategories()
        
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
async function getFilters() {                                               
    const response = await fetch ("http://localhost:5678/api/categories")   
    return await response.json()  

}
getFilters()

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
function dataFilter(categories, filter) {
    // Create btn "Tous"
    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.className = "btn";
    allButton.dataset.category = "Tous";
    filter.appendChild(allButton);

    // Create each btn of category
    categories.forEach((categorie) => {
        const button = document.createElement("button");
        button.innerText = categorie.name;
        button.className = "btn";
        button.dataset.category = categorie.name;
        filter.appendChild(button);
    });

    // Call function filter
    functionFilter();
}


// Filter / Apres ma fonction de creation de btn => new fonction avec objet array(.filter) 
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
        const pOpenModal = document.querySelector("#portfolio p")

        //Event listener modal

        //Open modal
        pOpenModal.addEventListener("click", openModal)
        btnModal1.addEventListener("click", openNewModal)
        //Close Modal
        modalClose.addEventListener("click", closeModal)
        overlay.addEventListener("click", closeModal)
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

/****Open modal*****/
function openModal(){
    overlay.style.display = 'block'
    modal1.style.display = 'block'
    modal2.style.display = 'none'

}
//*******Close Modal*******/

function closeModal(){
    modal1.style.display = 'none'
    overlay.style.display = 'none'
    modal2.style.display = 'none'

}
//***************Create Modal gallery**********/
function modalDataGallery(data){
    modalGallery = document.querySelector('.modal_gallery')
    modalGallery.innerHTML = ""

    data.forEach((i) => {
        const litleCard = document.createElement("figure")
        const litleImage = document.createElement("img")
        const binIcon = document.createElement("i")

        binIcon.id = i.id
        binIcon.classList.add("fa-solid", "fa-trash-can")
        litleImage.src = i.imageUrl
        litleImage.alt = i.title

        litleCard.className = "litleCard"
        modalGallery.appendChild(litleCard)
        litleCard.append(litleImage,binIcon)
        //Open modal
        
        
        //**Delete mode**/
        document.addEventListener("click",btnDelet)
    })
}

//******Delete mode********/

const btnDelet = function(e) {
    e.preventDefault()
    if(e.target.matches(".fa-trash-can")){
        deleteWork(e.target.id)
    }
}
//Call API to delete work*///

function deleteWork(i){
    let token = sessionStorage.getItem("token")
    fetch("http://localhost:5678/api/works/" + i, {
        method:`DELETE`,
        headers: {
            authorization: `Bearer ${token}`,
        },
    }).then((response) => {
        if(response.status = 200){
            worksData = worksData.filter((work) => work.id != i)
            modalDataGallery(worksData)
        }else{
            console.log(response.status)
        }
    })
}

//*********************************Modal 2***********/

function openNewModal(){
    modal1.style.display = 'none'
    modal2.style.display = 'block'
    btnadd.style.backgroundColor = "#A7A7A7";
    previewPict.style.display = 'none';

    fileInput.addEventListener(("change"),() => {
    const file = fileInput.files[0]
    console.log(file)
        if(file){
            const reader = new FileReader()

            reader.onload = function(e) {
                previewimg.innerHTML = ""
                previewimg.src = e.target.result
                console.log(previewimg)
            
            }

            reader.readAsDataURL(file)
            console.log(file)

        }
    })

    //Other events
    modalCloseTwo.addEventListener("click", closeModal)
    overlay.addEventListener("click", closeModal)
    
}

function returnBack(){
    backBtn.addEventListener("click", openModal);
}
returnBack()

//******ADD Picture*****/


/****function picturePreview(){
    fileInput.addEventListener(("change"),() => {
        const file = fileInput.files[0]
        console.log(file)
        if(file){
            const reader = new FileReader()

            reader.onload = function(e) {
                previewimg.innerHTML = ""
                previewimg.src = e.target.result
                console.log(previewimg)
            }

            reader.readAsDataURL(file)
            console.log(file)
        }
    })
***/


/*********const picturePreview = function(){
    const [file] = pictureInput.files;
    if (file) {
        const fileURL = URL.createObjectURL(file);
        document.querySelector('#previewPictImg').src = fileURL;
        document.querySelector('#previewPict').style.display = 'flex';
        document.querySelector('#labelpicture').style.display = 'none';
    } else {
        console.error("Aucun fichier sélectionné");
    }
}
**/
