export const ImageDataToFile = async imageData => {
  /**
   * Convert image data into File format.
   */
  if (!imageData) return Promise.reject();
  else
    return fetch(imageData)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], "capture.jpg", { type: "image/jpeg" }));
};

export const FileToBase64 = file => new Promise((resolve, reject) => {
  /**
   * Convert File format image to base64.
   */
  if (!file) return Promise.reject();
  else {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  }
});