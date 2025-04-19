function openNewModal() {
    modal1.style.display = 'none';
    modal2.style.display = 'block';
    btnadd.style.backgroundColor = "#A7A7A7";
    previewPict.style.display = 'none';
  
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
          previewimg.src = '';
          previewPict.innerHTML = '';
          previewimg.src = e.target.result;
          previewPict.style.display = 'flex';
  
          labelPicture.style.display = 'none';
  
          const imgElement = document.createElement('img');
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
    const title = formTitle.value;
    const categoryName = selectCategory.options[selectCategory.selectedIndex].innerText;
    const categoryId = selectCategory.options[selectCategory.selectedIndex].id;
    const image = fileInput.files[0];
  
    const validity = formValidation(image, title, categoryId);
    if (!validity) return;
  
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categoryId);
  
    postNewWorkApi(token, formData)
      .then((response) => {
        if (response.ok) {
          alert("Nouveau fichier envoyé avec succès : " + title);
          return response.json();
        } else {
          console.error("Erreur:", response.status);
        }
      })
      .then((data) => {
        if (data) {
          addToWorksData(data, categoryName);
          dataGallery(worksData);
          closeModal();
          softFreshForm();
        }
      })
      .catch((error) => console.error("Erreur:", error));
  }
  