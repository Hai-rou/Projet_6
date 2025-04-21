const ApiUrl = "http://localhost:5678/api/";

async function getWorks() {
  const response = await fetch(`${ApiUrl}works`);
  return await response.json();
}

async function getCategories() {
  const response = await fetch(`${ApiUrl}categories`);
  return await response.json();
}

function deleteWorkApi(id, token) {
  return fetch(`${ApiUrl}works/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

function postNewWorkApi(token, formData) {
  return fetch(`${ApiUrl}works`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}
