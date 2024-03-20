$(document).ready(function () {

  let x = 0;
  let degrees = 0;
  let img = new Image();
  let fileName = "";
  let rotate = false;
  let wrh = 0;
  let newWidth = 0;
  let newHeight = 0;
  let cropper = "";
  let caman;
  let url;
  let isChecked = false;
  let i = 0;
  let j = 0;
  let minY;
  let maxY;
  const uploadFile = document.getElementById("upload-file");
  const modalView = document.getElementById('myModal');
  const uploadResult = document.getElementById('upload-result');
  const saveResult = document.getElementById('save-result');
  $('.image-viewer').hide();
  $('#upload-result').hide();
  $('#save-result').hide();

  function showModal(isShow) {
    if (isShow) {
      $(modalView).show();
    } else {
      $(modalView).hide();
    }
  }
  function showModifiedImage() {
    setTimeout(() => {
      const ctx = $('#canvas1')[0].getContext('2d');
      const distance = maxY - minY + 4;

      const croppedCanvas = cropper.getCroppedCanvas({
        fillColor: "#fff",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
        width: distance + 3,
        height: distance,
      });
      ctx.drawImage(croppedCanvas, 0, 0, croppedCanvas.width, croppedCanvas.height, canvas1.width / 2 - 3 - distance / 2, minY - 2, distance + 3, distance);

      ctx.drawImage(modelImage, 0, 0);
      // $('#modelImage').attr('src', canvas1.toDataURL('image/jpeg', 0.8));
      // ctx.fillRect(canvas1.width / 2 - 3 - distance / 2, minY - 3, distance + 3, distance + 3);
    }, 1);
  }
  uploadFile.addEventListener("change", (e) => {
    const file = document.getElementById("upload-file").files[0];
    const reader = new FileReader();

    if (file) {
      fileName = file.name;
      reader.readAsDataURL(file);
    }
    const formData = new FormData();
    let str = Date.now() + 'userimage.jpg';
    formData.append('userImg', file, str);


    fetch('upload.php', {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) {
      } else {
        console.error('Error uploading image.');
      }
    })

    reader.addEventListener("load", () => {
      url = URL.createObjectURL(file);
      const canvas = document.createElement('canvas');
      const canvas1 = document.createElement('canvas');
      $(canvas).attr('id', 'canvas');
      $(canvas1).attr('id', 'canvas1');

      const modelImage = document.getElementById('modelImage');
      $('.canvasconatainer').append(canvas);
      $('#modified').append(canvas1);

      caman = Caman(canvas, url, function () {
        //alert('file url: ' + url);

        URL.revokeObjectURL(url);
        cropper = new Cropper(canvas, {
          zoomable: true,
          zoomOnWheel: true,
          viewMode: 0,
          background: false,
          rotatable: true,
        });
        cropper.setAspectRatio(1);
        setTimeout(() => {
          showModifiedImage();
        }, 1);
      });

      setTimeout(() => {
        const ctx = $('#canvas1')[0].getContext('2d');
        const img = new Image();
        img.src = modelImage.src;
        console.log(img.width, img.height);
        canvas1.width = img.width;
        canvas1.height = img.height;
        ctx.drawImage(modelImage, 0, 0);
        maxY = 0;
        minY = canvas1.height;
        //  Iterate over each pixel in the image
        for (let y = 0; y < canvas1.height; y++) {
          if (ctx.getImageData(canvas1.width / 2 - 3, y, 1, 1).data[3] === 0) {
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
        }

      }, 1)

      canvas.addEventListener('crop', function (event) {
        showModifiedImage();
      });
      canvas.addEventListener('zoom', function (event) {
        showModifiedImage();
      });
      canvas.addEventListener('wheel mousewheel DOMMouseScroll', function (event) {
        showModifiedImage();
      });
      canvas.addEventListener('cropstart', function (event) {
        showModifiedImage();
      });
      canvas.addEventListener('cropmove', function (event) {
        showModifiedImage();
      });
      canvas.addEventListener('cropend', function (event) {
        showModifiedImage();
      });

      //var uploadedImageURL = URL.createObjectURL(file);
      // $(modalImage).attr('src', uploadedImageURL);
      showModal(true);
    });
  });

  saveResult.addEventListener('click', () => {
    const save = document.createElement('a');
    save.href = $('#result').attr('src');
    save.target = '_blank';
    save.download = 'image.jpg'
    save.click();
    (window.URL || window.webkitURL).revokeObjectURL(save.href);
  });

  uploadResult.addEventListener("click", () => {
    const croppedCanvasData = cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.8);
    let byteString = atob(croppedCanvasData.split(',')[1]);
    let mimeString = croppedCanvasData.split(',')[0].split(':')[1].split(';')[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ab], { type: mimeString });
    const formData = new FormData();
    let str = Date.now() + 'cropped.jpg';
    formData.append('croppedImg', blob, str);

    const resultData = canvas1.toDataURL('image/jpeg', 0.8);
    byteString = atob(resultData.split(',')[1]);
    mimeString = resultData.split(',')[0].split(':')[1].split(';')[0];
    ab = new ArrayBuffer(byteString.length);
    ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    blob = new Blob([ab], { type: mimeString });
    str = Date.now() + 'result.jpg';
    formData.append('resultImg', blob, str);

    fetch('upload.php', {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) {
        console.log('Image uploaded successfully.');
        alert('Upload Successful');
      } else {
        console.error('Error uploading image.');
      }
    })
  });
  document.getElementById("rotate").addEventListener("click", () => {
    caman.render(function () {
      cropper.rotate(90);
      cropper.replace(this.toBase64(), true);
      setTimeout(() => {
        showModifiedImage();
      }, 1);
    });
  });

  document.getElementById("zoomOut").addEventListener("click", () => {
    caman.render(function () {
      cropper.zoom(-0.1);
      cropper.replace(this.toBase64(), true);
    });
  });

  document.getElementById("zoomIn").addEventListener("click", () => {
    caman.render(function () {
      cropper.zoom(0.1);
      cropper.replace(this.toBase64(), true);
    });
  });

  document.getElementById("select").addEventListener("click", () => {
    showModal(false);
    $('#upload-file-box').hide();
    const croppedCanvas = cropper.getCroppedCanvas({
      fillColor: "#fff",
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });
    $('.crop-image').attr('src', croppedCanvas.toDataURL('image/jpeg', 0.8));
    $('.image-viewer').show();
    $('#upload-result').show();
    $('#save-result').show();
    const ctx = $('#canvas1')[0].getContext('2d');
    $('#result').attr('src', canvas1.toDataURL('image/jpeg', 0.8));
  });
  $('.edit').on('click', function () {
    showModal(true);
  });
  $('.remove').on('click', function () {
    $('#upload-file-box').show();
    $('.image-viewer').hide();
    $('#upload-file').val(null);
    $('.canvasconatainer').empty();
    $('#modified').empty();
    $('#upload-result').hide();
    $('#save-result').hide();
    $('#result').attr('src', modelImage.src);
    showModal(false);
    delete cropper;
  })
});