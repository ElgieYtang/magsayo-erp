import { request, requestBlob } from '@/lib/api'

function fetchAccomplishments() {
  return request('/accomplishments').then((payload) => payload.data ?? [])
}

function fetchAccomplishment(id) {
  return request(`/accomplishments/${encodeURIComponent(id)}`).then((payload) => payload.data)
}

function createAccomplishment(data) {
  return request('/accomplishments', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

function updateAccomplishment(id, data) {
  return request(`/accomplishments/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

function deactivateAccomplishment(id) {
  return request(`/accomplishments/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

function uploadAccomplishmentPhotos(id, files) {
  const body = new FormData()
  for (const file of files) {
    body.append('photos[]', file)
  }

  return request(`/accomplishments/${encodeURIComponent(id)}/photos`, {
    method: 'POST',
    body,
  })
}

function deleteAccomplishmentPhoto(id, photoId) {
  return request(
    `/accomplishments/${encodeURIComponent(id)}/photos/${encodeURIComponent(photoId)}`,
    { method: 'DELETE' },
  )
}

async function hydrateAccomplishmentImages(report) {
  if (!report?.images?.length) {
    return { ...report, images: [] }
  }

  const images = await Promise.all(
    report.images.map(async (image) => {
      try {
        const blob = await requestBlob(image.src)
        return {
          ...image,
          src: URL.createObjectURL(blob),
          blobUrl: true,
        }
      } catch {
        return image
      }
    }),
  )

  return { ...report, images }
}

function revokeHydratedImages(images = []) {
  images.forEach((image) => {
    if (image?.blobUrl && typeof image.src === 'string' && image.src.startsWith('blob:')) {
      URL.revokeObjectURL(image.src)
    }
  })
}

export {
  createAccomplishment,
  deactivateAccomplishment,
  deleteAccomplishmentPhoto,
  fetchAccomplishment,
  fetchAccomplishments,
  hydrateAccomplishmentImages,
  revokeHydratedImages,
  updateAccomplishment,
  uploadAccomplishmentPhotos,
}
