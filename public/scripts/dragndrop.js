const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("image");
const fileList = document.getElementById("file-list");
const uploadError = document.getElementById("upload-error");

const MAX_FILES = 5;

let selectedFiles = [];

dropZone.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();

  dropZone.classList.remove("dragover");

  const newFiles = [...e.dataTransfer.files];

  validateAndAddFiles(newFiles);
});

fileInput.addEventListener("change", () => {
  const newFiles = [...fileInput.files];

  validateAndAddFiles(newFiles);
});

function validateAndAddFiles(newFiles) {
  uploadError.textContent = "";

  if (selectedFiles.length + newFiles.length > MAX_FILES) {
    uploadError.textContent = `You can only upload up to ${MAX_FILES} images.`;

    fileInput.value = "";

    return;
  }

  selectedFiles = [...selectedFiles, ...newFiles];

  updateInputFiles();

  renderFileList();
}

function renderFileList() {
  fileList.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const div = document.createElement("div");

      div.classList.add("file-item");

      div.innerHTML = `
        <button
          type="button"
          class="remove-btn"
          data-index="${index}"
        >
          ×
        </button>

        <img src="${e.target.result}" alt="${file.name}">

        <div class="file-name">
          ${file.name}
        </div>
      `;

      fileList.appendChild(div);
    };

    reader.readAsDataURL(file);
  });
}

fileList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.dataset.index;

    selectedFiles.splice(index, 1);

    uploadError.textContent = "";

    updateInputFiles();

    renderFileList();
  }
});

function updateInputFiles() {
  const dataTransfer = new DataTransfer();

  selectedFiles.forEach((file) => {
    dataTransfer.items.add(file);
  });

  fileInput.files = dataTransfer.files;
}
