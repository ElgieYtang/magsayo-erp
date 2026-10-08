import {
  createSetupRecord,
  deactivateSetupRecord,
  fetchSetupList,
  updateSetupRecord,
} from '@/lib/setupApi'
import { useCallback, useEffect, useState } from 'react'

export function useSetupResource(resource) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchSetupList(resource)
      setRows(data)
    } catch (caught) {
      setError(caught?.message ?? 'Could not load setup records.')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [resource])

  useEffect(() => {
    refresh()
  }, [refresh])

  const add = useCallback(
    async (payload) => {
      await createSetupRecord(resource, payload)
      await refresh()
    },
    [resource, refresh],
  )

  const edit = useCallback(
    async (id, payload) => {
      await updateSetupRecord(resource, id, payload)
      await refresh()
    },
    [resource, refresh],
  )

  const remove = useCallback(
    async (id) => {
      await deactivateSetupRecord(resource, id)
      await refresh()
    },
    [resource, refresh],
  )

  return {
    rows,
    loading,
    error,
    refresh,
    add,
    edit,
    remove,
  }
}

export function useSetupOptions(resource) {
  const { rows, loading } = useSetupResource(resource)

  const options = rows
    .filter((row) => row.status !== 'Inactive')
    .map((row) => ({
      value: row.id,
      label: row.name ?? row.code ?? row.id,
    }))

  return { options, loading, rows }
}
