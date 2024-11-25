const siteName = document.getElementById("siteName");
const siteURL = document.getElementById("Url");
const submitBtn = document.getElementById("submit-btn");
const tableContent = document.getElementById("contanet-holder");
const closeBtn = document.getElementById("closeBtn");
const boxModal = document.querySelector(".Error-info");
let bookmarks = [];

if (localStorage.getItem("bookmarksList")) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  bookmarks.forEach((_, index) => displayBookmark(index));
}

console.log(bookmarks);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function displayBookmark(index) {
  const { siteName } = bookmarks[index];

  const newRow = document.createElement("tr");
  newRow.dataset.index = index;

  newRow.innerHTML = `
    <td>${index + 1}</td>
    <td>${capitalize(siteName)}</td>
    <td>
      <button class="btn btn-visit">
        <i class="fa-solid fa-eye pe-2"></i>Visit
      </button>
    </td>
    <td>
      <button class="btn btn-delete">
        <i class="fa-solid fa-trash-can pe-2"></i>Delete
      </button>
    </td>
  `;

  tableContent.appendChild(newRow);
}

function clearInput() {
  siteName.value = "";
  siteURL.value = "";
  siteName.classList.remove("is-valid", "is-invalid");
  siteURL.classList.remove("is-valid", "is-invalid");
}

function validate(element, regex) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}

function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  tableContent.innerHTML = "";
  bookmarks.forEach((_, idx) => displayBookmark(idx));
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
  console.log(bookmarks);
}

function visitWebsite(index) {
  const httpsRegex = /^https?:\/\//;
  const url = httpsRegex.test(bookmarks[index].siteURL)
    ? bookmarks[index].siteURL
    : `https://${bookmarks[index].siteURL}`;
  window.open(url, "_blank");
}

tableContent.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  console.log(row);
  if (!row) return;
  const index = Number(row.dataset.index);

  if (e.target.closest(".btn-delete")) {
    deleteBookmark(index);
  }

  if (e.target.closest(".btn-visit")) {
    visitWebsite(index);
  }
});

submitBtn.addEventListener("click", () => {
  if (
    siteName.classList.contains("is-valid") &&
    siteURL.classList.contains("is-valid")
  ) {
    const bookmark = {
      siteName: siteName.value.trim(),
      siteURL: siteURL.value.trim(),
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    displayBookmark(bookmarks.length - 1);
    clearInput();
  } else {
    boxModal.classList.remove("d-none");
  }
});

function closeModal() {
  boxModal.classList.add("d-none");
}

closeBtn.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

document.addEventListener("click", (e) => {
  if (e.target === boxModal) closeModal();
});

const nameRegex = /^\w{3,}(\s+\w+)*$/;
const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(:\d{2,5})?(\/\S*)?$/;

siteName.addEventListener("input", () => validate(siteName, nameRegex));
siteURL.addEventListener("input", () => validate(siteURL, urlRegex));
