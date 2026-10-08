import { useTransactions } from '@/context/TransactionContext'
import { useUserSettings } from '@/hooks/useUserSettings'
import {
  getReadNotificationIds,
  markNotificationRead,
  pruneReadNotificationIds,
} from '@/lib/notificationReadState'
import { buildNotifications } from '@/lib/notifications'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useNotifications() {
  const transactions = useTransactions()
  const { settings } = useUserSettings()
  const [readVersion, setReadVersion] = useState(0)

  const notifications = useMemo(
    () =>
      buildNotifications(
        {
          quotations: transactions.quotations,
          purchaseOrders: transactions.purchaseOrders,
          receivings: transactions.receivings,
          outslips: transactions.outslips,
          deliveryReceipts: transactions.deliveryReceipts,
          billingStatements: transactions.billingStatements,
        },
        settings,
      ),
    [
      transactions.quotations,
      transactions.purchaseOrders,
      transactions.receivings,
      transactions.outslips,
      transactions.deliveryReceipts,
      transactions.billingStatements,
      settings,
    ],
  )

  useEffect(() => {
    pruneReadNotificationIds(notifications.map((item) => item.id))
  }, [notifications])

  const readIds = useMemo(() => {
    void readVersion
    return getReadNotificationIds()
  }, [readVersion, notifications])

  const enriched = useMemo(
    () =>
      notifications.map((item) => ({
        ...item,
        unread: item.active && !readIds.has(item.id),
      })),
    [notifications, readIds],
  )

  const unreadCount = useMemo(
    () => enriched.filter((item) => item.unread).length,
    [enriched],
  )

  const markAsRead = useCallback((id) => {
    markNotificationRead(id)
    setReadVersion((version) => version + 1)
  }, [])

  return {
    notifications: enriched,
    count: unreadCount,
    totalCount: enriched.length,
    enabled: !!settings.notify_in_app,
    loading: transactions.loading,
    markAsRead,
  }
}
