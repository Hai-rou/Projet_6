let categories;

function listOfcategories(worksData) {
  let list = new Set();
  worksData.forEach((work) => {
    list.add(JSON.stringify(work.category));
  });

  const arrayofStrings = [...list];
  categories = arrayofStrings.map((s) => JSON.parse(s));
  return categories;
}

function dataFilter(categories, filter) {
  const allButton = document.createElement("button");
  allButton.innerText = "Tous";
  allButton.className = "btn";
  allButton.dataset.category = "Tous";
  filter.appendChild(allButton);

  categories.forEach((cat) => {
    const button = document.createElement("button");
    button.innerText = cat.name;
    button.className = "btn";
    button.dataset.category = cat.name;
    filter.appendChild(button);
  });

  functionFilter();
}

function functionFilter() {
  const filterbuttons = document.querySelectorAll(".btn");
  filterbuttons.forEach((i) => {
    i.addEventListener("click", function () {
      toggleProjects(i.dataset.category);
    });
  });
}

function toggleProjects(datasetCategory) {
  const figures = document.querySelectorAll(".workCard");
  if (datasetCategory === "Tous") {
    figures.forEach((figure) => (figure.style.display = "block"));
  } else {
    figures.forEach((figure) => {
      figure.dataset.category === datasetCategory
        ? (figure.style.display = "block")
        : (figure.style.display = "none");
    });
  }
}
