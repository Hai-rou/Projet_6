function softFreshForm() {
    document.querySelectorAll('form').forEach(form => form.reset());
    labelPicture.style.display = 'flex';
  }
  
  function addToWorksData(data, categoryName) {
    const newWork = {
      title: data.title,
      id: data.id,
      category: { id: data.categoryId, name: categoryName },
      imageUrl: data.imageUrl
    };
    worksData.push(newWork);
  }
  