// Read an image file and shrink it in the browser before upload: phone photos
// are several MB, and the API accepts at most 5MB of JSON. Output is a JPEG
// data URL no larger than maxSize on its longest side.
export const fileToResizedDataURL = (file, maxSize = 1600, quality = 0.85) =>
  new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith("image/")) {
      reject(new Error("not-an-image"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable-image"));
    };
    img.src = url;
  });
