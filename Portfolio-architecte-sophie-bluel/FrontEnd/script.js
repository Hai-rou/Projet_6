//Data 
const ApiUrl = "http://localhost:5678/api/"
let worksData;
let categories;

let filter;
let gallery;
let modalStep = null;
let pictureInput;

/****Admin items */
const filterElement = document.querySelector(".filter")
const logLinkElement = document.getElementById("logLink")
/***Overlay */
const overlay = document.querySelector('.overlay')
/**Modal 1 items*/
const modal1 = document.querySelector('.modal')
const modalClose = document.querySelector(".modal_close")
/***Modal 2 items */
const pictureForm = document.querySelector('#addPictureForm')
const labelPicture = document.querySelector('#labelpicture')
const modal2 = document.querySelector('#modal2')
const btnadd = document.querySelector('#btnadd')
const backBtn = document.querySelector('#return')
const modalCloseTwo = document.querySelector("#closeTwo")
const btnModal1 = document.querySelector(".modal_btn_add_pict")

//**Form */
const previewimg = document.querySelector('#previewPictImg')
const formTitle = document.getElementById("title")
const previewPict = document.querySelector('#previewPict')
const fileInput = document.querySelector('#photo');
/****Select category */
const selectCategory = document.querySelector("#selectCategory")


// FETCH works data from API and display it
window.onload = () => {
  fetch(`${ApiUrl}works`)
    .then((response) => response.json())
    .then((data) => {
      worksData = data;
      //get list of categories
      listOfcategories();
      //display all works
      dataGallery(worksData);
      //Filter functionnality
      filter = document.querySelector(".filter");
      dataFilter(categories, filter);
      //administrator mode
      adminUserMode(filter);
    });
};

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

/****Get array category**/
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

//********ADMIN MODE******//

function adminUserMode() {
    console.log("Fonction isAdmin appelée")
    const token = sessionStorage.getItem("token")
  if (sessionStorage.getItem("token")?.length == 143) {
    //Hide filter
    filterElement.style.display = "none";
    //change login to logout
    logLinkElement.innerText = "Logout";
    //display top menu bar
    const body = document.querySelector("body");
    const topMenu = document.createElement("div");
    
    const editMode = document.createElement("p");

    topMenu.className = "topMenu";
    editMode.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Mode édition`;
   

    body.insertAdjacentElement("afterbegin", topMenu);
    topMenu.append(editMode);
    //edit buttons
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
//*************Delete token when logout**************/

document.getElementById("logLink").addEventListener("click", (e) => {
    e.preventDefault()
    sessionStorage.removeItem("token")
    window.location.href="login.html"
})


//*********MODAL*******//

//open modal if token is found and has the expected length
function openModal() {
    overlay.style.display = 'block'
    modal1.style.display = 'block'
    modal2.style.display = 'none'
    modalStep = 0;
    modalDataGallery(worksData)
};

//close modal
function closeModal() {
    modal1.style.display = 'none'
    overlay.style.display = 'none'
    modal2.style.display = 'none'  
    modalStep = null;
}

//***************Create Modal gallery**********/
function modalDataGallery(worksData){
    modalGallery = document.querySelector('.modal_gallery')
    modalGallery.innerHTML = ""

    worksData.forEach((i) => {
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
        //**Delete mode**/
        binIcon.addEventListener("click", btnDelet)
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

//*************ADD WORK***************/

//display add work form
function openNewModal(){
    modal1.style.display = 'none'
    modal2.style.display = 'block'
    btnadd.style.backgroundColor = "#A7A7A7";
    previewPict.style.display = 'none';

    //function
    selectCategoryForm()

    //Other events
    pictureForm.onchange = switchBtnColor
    fileInput.addEventListener("click",picturePreview)
    modalCloseTwo.addEventListener("click", closeModal)
    overlay.addEventListener("click", closeModal)
    btnadd.addEventListener("click", newWorkSubmit)
    btnadd.addEventListener("click", closeModal)
}

function returnBack(){
    backBtn.addEventListener("click", openModal);
}
returnBack()

// Fonction pour prévisualiser l'image
function picturePreview() {
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Vider la prévisualisation existante avant d'ajouter une nouvelle image
                previewimg.src = '';  // Vider l'image précédente
                previewPict.innerHTML = ''; // Vider tout contenu de #previewPict

                // Afficher l'image dans la prévisualisation
                previewimg.src = e.target.result;
                previewPict.style.display = 'flex'; // Afficher la prévisualisation de l'image

                // Changer le label pour l'image sélectionnée
                const label = document.querySelector('#labelpicture');
                const labelContainer = document.querySelector('#previewPict'); // Conteneur du label

                // Cacher l'icône et le texte
                label.style.display = 'none';  // Cacher le label

                // Créer un élément <img> et l'ajouter à la place du label
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.alt = 'Image sélectionnée';
                imgElement.style.width = '35%'; // Ou ajuster la taille de l'image comme tu veux

                // Ajouter l'image dans le conteneur du label
                labelContainer.appendChild(imgElement);
            };
            reader.readAsDataURL(file);
        }
    });
}
picturePreview();

//category options for form
function selectCategoryForm() {
  //reset categories
  selectCategory.innerHTML = "";
  //empty first option
  option = document.createElement("option");
  selectCategory.append(option);
  //options from categories array
  categories.forEach((categorie) => {
    option = document.createElement("option");
    option.value = categorie.name;
    option.innerText = categorie.name;
    option.id = categorie.id;
    selectCategory.appendChild(option);
  });
};

//Switch color submit button

const switchBtnColor = function() {
  const select = document.getElementById("selectCategory");
  if (formTitle.value !== "" && fileInput.files[0] !== undefined && select.options[select.selectedIndex].id !== "") {
    btnadd.style.backgroundColor = "#1D6154";
  }
}

//form validation
const formValidation = function(image, title, categoryId) {
  if (image == undefined){
    alert("Veuillez ajouter une image");
    return false;
  }
  if (title.trim().length == 0){    
    alert("Veuillez ajouter un titre");
    return false;
  }
  if (categoryId == ""){
    alert("Veuillez choisir une catégorie");
    return false;
  }else{
  return true;
  }
}

//submit work form event listener
const newWorkSubmit = function (e) {
  if (e.target === document.querySelector("#btnadd")) {
    e.preventDefault();
    postNewWork();
  }
}

//POST new work
function postNewWork() {
  let token = sessionStorage.getItem("token");
  console.log(token)
  //get data from form
  const title = document.getElementById("title").value;
  const categoryName = selectCategory.options[selectCategory.selectedIndex].innerText;
  const categoryId = selectCategory.options[selectCategory.selectedIndex].id;
  const image = document.getElementById("photo").files[0];
  //check form validity
  let validity = formValidation(image, title, categoryId);
  if (validity === true) {
    //create FormData
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categoryId);
    // send collected data to API
    sendNewData(token, formData, title, categoryName);
  }
};

//Refresh Form
function softFreshForm(){
  document.querySelectorAll('Form').forEach(form => form.reset())
  labelPicture.style.display = 'flex'
}

//add new work in worksData array for dynamic display using API response
const addToWorksData = function(data, categoryName) {
  newWork = {};
  newWork.title = data.title;
  newWork.id = data.id;
  newWork.category = {"id" : data.categoryId, "name" : categoryName};
  newWork.imageUrl = data.imageUrl;
  worksData.push(newWork);
}

//API call for new work
function sendNewData(token, formData, title, categoryName) {
  fetch(`${ApiUrl}works`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        alert("Nouveau fichier envoyé avec succés : " + title);
        return response.json();
      } else {
        console.error("Erreur:", response.status);
      }
    })
    .then ((data) => {
      addToWorksData(data, categoryName);
      dataGallery(worksData);
      modal1.style.display = "none";
      document.removeEventListener("click", closeModal);
      modalStep = null;
      softFreshForm()
    })
    .catch((error) => console.error("Erreur:", error));
}

