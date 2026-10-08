const DB_NAME = 'rts-erp'
const STORE_NAME = 'accomplishment-report-images'
const DB_VERSION = 1

function storageKey(reportId, imageId) {
  return `${reportId}::${imageId}`
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(request.error ?? new Error('Could not open image store.'))
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('reportId', 'reportId', { unique: false })
      }
    }
  })
}

async function loadAccomplishmentImages(reportId) {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.index('reportId').getAll(reportId)

    request.onerror = () => {
      reject(request.error ?? new Error('Could not load saved pictures.'))
    }

    request.onsuccess = () => {
      const records = (request.result ?? []).sort((left, right) => left.createdAt - right.createdAt)

      resolve(
        records.map((record) => ({
          id: record.imageId,
          alt: record.alt,
          src: URL.createObjectURL(record.blob),
        }))
      )
    }
  })
}

async function saveAccomplishmentImage(reportId, image) {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put({
      id: storageKey(reportId, image.id),
      reportId,
      imageId: image.id,
      alt: image.alt,
      blob: image.blob,
      createdAt: Date.now(),
    })

    request.onerror = () => {
      reject(request.error ?? new Error('Could not save picture.'))
    }

    request.onsuccess = () => {
      resolve()
    }
  })
}

async function deleteAccomplishmentImage(reportId, imageId) {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(storageKey(reportId, imageId))

    request.onerror = () => {
      reject(request.error ?? new Error('Could not delete picture.'))
    }

    request.onsuccess = () => {
      resolve()
    }
  })
}

export {
  deleteAccomplishmentImage,
  loadAccomplishmentImages,
  saveAccomplishmentImage,
}
