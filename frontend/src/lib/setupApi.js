import { request } from '@/lib/api'

const SETUP_RESOURCES = [
  'companies',
  'branches',
  'users',
  'positions',
  'projects',
  'categories',
  'brands',
  'models',
  'units',
  'items',
  'suppliers',
  'customers',
]

function fetchSetupList(resource) {
  return request(`/setup/${resource}`).then((payload) => payload.data ?? [])
}

function createSetupRecord(resource, data) {
  return request(`/setup/${resource}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

function updateSetupRecord(resource, id, data) {
  return request(`/setup/${resource}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

function deactivateSetupRecord(resource, id) {
  return request(`/setup/${resource}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export {
  SETUP_RESOURCES,
  createSetupRecord,
  deactivateSetupRecord,
  fetchSetupList,
  updateSetupRecord,
}
