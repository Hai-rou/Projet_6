window.onload = async () => {
    worksData = await getWorks();
    categories = listOfcategories(worksData);
    dataGallery(worksData);
    dataFilter(categories, filterElement);
    adminUserMode(filterElement);
  };
  