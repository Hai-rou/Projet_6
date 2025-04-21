let gallery;

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
    workCard.dataset.category = i.category.name;
    workCard.className = "workCard";

    gallery.appendChild(workCard);
    workCard.append(workImage, workTitle);
  });
}
