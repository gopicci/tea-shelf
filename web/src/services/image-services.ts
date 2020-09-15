/**
 * Converts image data into File format.
 *
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise<File>}
 * @category Services
 */
export async function imageDataToFile(imageData: string): Promise<File> {
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
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) return Promise.reject();
    else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      console.log(reader)

      reader.onloadend = (e) => {
        const img = new Image();
        img.src = ""; // onload event sometimes won't fire in webkit without this
        img.onload = (e) => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, img.width, img.height);
          console.log(ctx?.getImageData(0, 0, img.width, img.height))
          const dataURL = canvas.toDataURL("image/jpeg", 90);
          console.log(dataURL)
          resolve(dataURL);
        };
        if (typeof reader.result === "string") img.src = reader.result;
      };
      reader.onerror = (error) => reject(error);
    }
  });
}

/**
 * Crops a data URI from the center.
 *
 * @param {string} data - Base64 encoded image
 * @param {number} width - Crop width
 * @param {height} height - Crop height
 * @returns {Promise<string>}
 */
export function cropDataURL(
  data: string,
  width: number,
  height: number
): Promise<string> {
  return new Promise(async function (resolve, reject) {
    const img = document.createElement("img");

    img.onload = function () {
      // Create canvas with source
      const source = document.createElement("canvas");
      source.width = img.width;
      source.height = img.height;
      let ctx = source.getContext("2d");
      ctx?.drawImage(img, 0, 0, img.width, img.height);

      // Get bottom left corner from source center
      const x = img.width / 2 - width / 2;
      const y = img.height / 2 - height / 2;

      // Create destination canvas with crop from source
      const dest = document.createElement("canvas");
      dest.width = width;
      dest.height = height;
      ctx = dest.getContext("2d");
      ctx?.drawImage(source, x, y, width, height, 0, 0, width, height);

      const dataURL = dest.toDataURL();
      resolve(dataURL);
    };
    img.src = data;
  });
}

/**
 * Resizes a data URI based on width and height.
 *
 * @param {string} data - Base64 encoded image
 * @param {number} width - Crop width
 * @param {height} height - Crop height
 * @returns {Promise<string>}
 */
export function resizeDataURL(
  data: string,
  width: number,
  height: number
): Promise<string> {
  return new Promise(async function (resolve, reject) {
    const img = document.createElement("img");

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      const dataURI = canvas.toDataURL();
      resolve(dataURI);
    };
    img.src = data;
  });
}

/**
 * Gets height of a data URI.
 *
 * @param {string} data - Base64 encoded image
 * @returns {Promise<{width: number, height: number}>}
 */
export function getImageSize(data: string): Promise<{width: number, height: number}> {
  return new Promise(async function (resolve, reject) {
    const img = new Image();
    img.onload = function () {
      const size = {width: img.width, height: img.height};
      resolve(size);
    };
    img.src = data;
  });
}
