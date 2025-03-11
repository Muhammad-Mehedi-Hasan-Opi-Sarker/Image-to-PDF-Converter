document.getElementById('uploadForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const files = document.getElementById('fileInput').files;
  if (files.length === 0) {
    alert('Please select image files.');
    return;
  }

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
});
