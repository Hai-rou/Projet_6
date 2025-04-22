function openNewModal() {
    modal1.style.display = 'none';
    modal2.style.display = 'block';
    btnadd.style.backgroundColor = "#A7A7A7";
    previewPict.style.display = 'none';
    labelPicture.style.display = 'flex'
  
    selectCategoryForm();
  
    pictureForm.onchange = switchBtnColor;
    fileInput.addEventListener("click", picturePreview);
    modalCloseTwo.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);
    btnadd.addEventListener("click", newWorkSubmit);
    btnadd.addEventListener("click", closeModal);
  }
  
  function returnBack() {
    backBtn.addEventListener("click", openModal);
  }
  returnBack();
  
  function picturePreview() {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewimg.src = ''; //On vide la source
          previewPict.innerHTML = '';//On vide le contenu 
          previewimg.src = e.target.result;
          previewPict.style.display = 'flex';//On fait spawn la div
  
          labelPicture.style.display = 'none';//On cache la div d'appel d'image
  
          const imgElement = document.createElement('img');//Création dynamique de l'élément image
          imgElement.src = e.target.result;
          imgElement.alt = 'Image sélectionnée';
          imgElement.style.width = '35%';
          previewPict.appendChild(imgElement);
        };
        reader.readAsDataURL(file);
      }
    });
  }
  picturePreview();
  //Création des options via Api categories
  function selectCategoryForm() {
    selectCategory.innerHTML = "";
    const option = document.createElement("option");
    selectCategory.append(option);
  
    categories.forEach((categorie) => {
      const opt = document.createElement("option");
      opt.value = categorie.name;
      opt.innerText = categorie.name;
      opt.id = categorie.id;
      selectCategory.appendChild(opt);
    });
  }
  //Changement de couleur du btn valider du formulaire
  function switchBtnColor() {
    const select = document.getElementById("selectCategory");
    if (
      formTitle.value !== "" &&
      fileInput.files[0] !== undefined &&
      select.options[select.selectedIndex].id !== ""
    ) {
      btnadd.style.backgroundColor = "#1D6154";
    }
  }
  //Check remplissage du formulaire avant l'envoie
  function formValidation(image, title, categoryId) {
    if (image == undefined) {
      alert("Veuillez ajouter une image");
      return false;
    }
    if (title.trim().length == 0) {
      alert("Veuillez ajouter un titre");
      return false;
    }
    if (categoryId == "") {
      alert("Veuillez choisir une catégorie");
      return false;
    }
    return true;
  }
  
  function newWorkSubmit(e) {
    if (e.target === document.querySelector("#btnadd")) {
      e.preventDefault();
      postNewWork();
    }
  }
  
  function postNewWork() {

    const token = sessionStorage.getItem("token");

    // ✍️ Récupération des valeurs du formulaire : titre et catégorie
    const title = formTitle.value;
    const categoryName = selectCategory.options[selectCategory.selectedIndex].innerText;// Nom de la catégorie (texte)
    const categoryId = selectCategory.options[selectCategory.selectedIndex].id;// ID de la catégorie

    // 🖼️ Récupération du fichier image sélectionné par l'utilisateur
    const image = fileInput.files[0];

    // ✅ Validation du formulaire (titre, catégorie, image)
    const validity = formValidation(image, title, categoryId);
    if (!validity) return;// Si invalide, on arrête la fonction ici
  
    // 📦 Création d'un objet FormData pour envoyer les données (y compris l'image)
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categoryId);
  
    // 📡 Envoi des données à l'API (API.JS)
    postNewWorkApi(token, formData)
      .then((response) => {
        if (response.ok) {
          // 👍 Si la réponse est positive (status 200)
          console.log("Nouveau fichier envoyé avec succès : " + title);
          return response.json();//🔄 On convertit la réponse en JSON
        } else {
          console.error("Erreur:", response.status);
        }
      })
      .then((data) => {
        if (data) {
          // 🆕 Si on a bien reçu les données du nouvel élément créé
          addToWorksData(data, categoryName);   // Ajout à la liste locale des images
          dataGallery(worksData);               // Rafraîchissement de la galerie affichée
          closeModal();                         // Fermeture de la fenêtre modale
          softFreshForm();                      // Réinitialisation douce du formulaire
        }
      })
      .catch((error) => console.error("Erreur:", error));
  }
  