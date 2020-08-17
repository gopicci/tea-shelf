/**
 * Convert image data into File format.
 */
export const ImageDataToFile = async (imageData) => {
  if (!imageData) return Promise.reject();
  else
    return fetch(imageData)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], "capture.jpg", { type: "image/jpeg" }));
};

/**
 * Convert File format image to base64. Reencoding it from canvas is safer
 * as certain jpgs have issues on Django.
 */
export const FileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return Promise.reject();
    else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        const img = new Image()
        img.src = "" // onload event sometimes won't fire in webkit without this
        img.onload = (e) => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, img.width, img.height)
          const dataUrl = canvas.toDataURL('image/jpeg', 90)
          resolve(dataUrl);
        };
        img.src = reader.result;
      }
      reader.onerror = (error) => reject(error);
    }
  });
