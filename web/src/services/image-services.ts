/**
 * Converts image data into File format.
 *
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise<File>}
 * @category Services
 */
export async function ImageDataToFile(imageData: string): Promise<File> {
  if (!imageData) return Promise.reject();
  else
    return fetch(imageData)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], "capture.jpg", { type: "image/jpeg" }));
}

/**
 * Converts image File to base64. Re-encoding it from canvas is safer as
 * Django base64 interpreter has issues with the encoding of certain jpg types.
 *
 * @param {File} file - Image input in File format
 * @returns {Promise<string>}
 * @category Services
 */
export function FileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) return Promise.reject();
    else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        const img = new Image();
        img.src = ""; // onload event sometimes won't fire in webkit without this
        img.onload = (e) => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, img.width, img.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 90);
          resolve(dataUrl);
        };
        if (typeof reader.result === "string") img.src = reader.result;
      };
      reader.onerror = (error) => reject(error);
    }
  });
}