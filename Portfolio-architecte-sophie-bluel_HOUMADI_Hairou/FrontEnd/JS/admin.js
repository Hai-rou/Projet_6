function adminUserMode(filter) {
    const token = sessionStorage.getItem("token");
  
    if (token?.length === 143) {
      filter.style.display = "none";
      logLinkElement.innerText = "Logout";
  
      const topMenu = document.createElement("div");
      const editMode = document.createElement("p");
      topMenu.className = "topMenu";
      editMode.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Mode édition`;
      topMenu.append(editMode);
      document.body.insertAdjacentElement("afterbegin", topMenu);
  
      const btnEdit = `<p class="btnEtid"><i class="fa-solid fa-pen-to-square"></i>Mode édition</p>`;
      document.querySelector("#portfolio h2").insertAdjacentHTML("afterend", btnEdit);
  
      const pOpenModal = document.querySelector("#portfolio p");
      pOpenModal.addEventListener("click", openModal);
      btnModal1.addEventListener("click", openNewModal);
      modalClose.addEventListener("click", closeModal);
      overlay.addEventListener("click", closeModal);
    }
  }
  
  logLinkElement.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    window.location.href = "login.html";
  });
  