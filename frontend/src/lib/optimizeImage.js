const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
function scaleToFit(width, height, maxWidth = MAX_IMAGE_DIMENSION, maxHeight = MAX_IMAGE_DIMENSION) {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
}
async function optimizeImageFile(file) {
  const source = await loadImageSource(file);
  const size = scaleToFit(source.width, source.height);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d");
  if (!context) {
    source.close();
    throw new Error("Could not optimize the selected picture.");
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(source.image, 0, 0, size.width, size.height);
  source.close();
  return canvasToJpeg(canvas, JPEG_QUALITY);
}
async function loadImageSource(file) {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image"
      });
      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close()
      };
    } catch {
    }
  }
  return loadImageElement(file);
}
function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        close: () => void 0
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not read ${file.name}.`));
    };
    image.src = objectUrl;
  });
}
function canvasToJpeg(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not compress the selected picture."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}
export {
  JPEG_QUALITY,
  MAX_IMAGE_DIMENSION,
  optimizeImageFile,
  scaleToFit
};
