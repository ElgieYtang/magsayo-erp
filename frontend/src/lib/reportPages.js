const IMAGES_PER_PAGE = 4;
function pageCountForImages(imageCount) {
  if (imageCount <= 0) return 1;
  return Math.ceil(imageCount / IMAGES_PER_PAGE);
}
function groupImagesIntoPages(images) {
  const pageCount = pageCountForImages(images.length);
  const pages = [];
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    const start = pageIndex * IMAGES_PER_PAGE;
    const end = start + IMAGES_PER_PAGE;
    pages.push(images.slice(start, end));
  }
  return pages;
}
function padImageSlots(images, size = IMAGES_PER_PAGE) {
  const slots = images.slice(0, size);
  while (slots.length < size) {
    slots.push(null);
  }
  return slots;
}
export {
  IMAGES_PER_PAGE,
  groupImagesIntoPages,
  padImageSlots,
  pageCountForImages
};
