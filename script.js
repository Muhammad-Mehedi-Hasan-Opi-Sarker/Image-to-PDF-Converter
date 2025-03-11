document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('uploadForm').addEventListener('submit', handleFormSubmit);

function handleFileSelect(event) {
  const files = event.target.files;
  const imageContainer = document.getElementById('imageContainer');
  imageContainer.innerHTML = '';

  Array.from(files).forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const div = document.createElement('div');
      div.classList.add('image-item');
      div.setAttribute('data-index', index);

      const img = document.createElement('img');
      img.src = e.target.result;

      const removeBtn = document.createElement('button');
      removeBtn.classList.add('remove-btn');
      removeBtn.textContent = 'X';
      removeBtn.addEventListener('click', () => {
        div.remove();
        updateFileInput();
      });

      div.appendChild(img);
      div.appendChild(removeBtn);
      imageContainer.appendChild(div);
    };
    reader.readAsDataURL(file);
  });

  new Sortable(imageContainer, {
    animation: 150,
    onEnd: () => {
      updateFileInput();
    }
  });
}

function updateFileInput() {
  const imageContainer = document.getElementById('imageContainer');
  const orderedFiles = [];
  const fileInput = document.getElementById('fileInput');
  
  Array.from(imageContainer.children).forEach((div) => {
    const index = div.getAttribute('data-index');
    orderedFiles.push(fileInput.files[index]);
  });

  const dataTransfer = new DataTransfer();
  orderedFiles.forEach(file => dataTransfer.items.add(file));
  fileInput.files = dataTransfer.files;
}

function handleFormSubmit(event) {
  event.preventDefault();
  
  const files = document.getElementById('fileInput').files;
  if (files.length === 0) {
    alert('Please select image files.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdfDoc = new jsPDF();
  let imageCount = 0;

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        if (imageCount > 0) {
          pdfDoc.addPage();
        }
        const width = pdfDoc.internal.pageSize.getWidth();
        const height = pdfDoc.internal.pageSize.getHeight();
        pdfDoc.addImage(img, 'JPEG', 0, 0, width, height);
        imageCount++;
        if (imageCount === files.length) {
          const pdfOutput = pdfDoc.output('blob');
          const downloadLink = document.getElementById('downloadLink');
          const url = URL.createObjectURL(pdfOutput);
          downloadLink.href = url;
          downloadLink.download = 'converted_images_to_pdf.pdf';
          downloadLink.style.display = 'block';
          downloadLink.textContent = 'Download PDF';
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}
