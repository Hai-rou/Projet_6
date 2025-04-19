let modalStep = null;

function openModal() {
  overlay.style.display = 'block';
  modal1.style.display = 'block';
  modal2.style.display = 'none';
  modalStep = 0;
  modalDataGallery(worksData);
}

function closeModal() {
  modal1.style.display = 'none';
  modal2.style.display = 'none';
  overlay.style.display = 'none';
  modalStep = null;
}

function modalDataGallery(worksData) {
  const modalGallery = document.querySelector('.modal_gallery');
  modalGallery.innerHTML = "";

  worksData.forEach((i) => {
    const litleCard = document.createElement("figure");
    const litleImage = document.createElement("img");
    const binIcon = document.createElement("i");

    binIcon.id = i.id;
    binIcon.classList.add("fa-solid", "fa-trash-can");
    litleImage.src = i.imageUrl;
    litleImage.alt = i.title;

    litleCard.className = "litleCard";
    litleCard.append(litleImage, binIcon);
    modalGallery.appendChild(litleCard);

    binIcon.addEventListener("click", btnDelet);
  });
}

function btnDelet(e) {
  e.preventDefault();
  if (e.target.matches(".fa-trash-can")) {
    deleteWork(e.target.id);
  }
}

function deleteWork(id) {
    const token = sessionStorage.getItem("token");
  
    deleteWorkApi(id, token).then((response) => {
      if (response.status === 200 || response.status === 204) {
        worksData = worksData.filter((work) => work.id != id);
        setTimeout(() => {
          modalDataGallery(worksData);
          dataGallery(worksData);
        }, 100);  // Petit délai pour laisser le temps à la suppression d'être prise en compte
      } else {
        console.log(response.status);
      }
    });
  }
