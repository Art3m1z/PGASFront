const addNotification = (text: string) => {}
const removeNotification = (id: number) => {}
const fetchNotifications = () => {}
const clearNotifications = () => {}

interface INotification {
  id: number
  text: string
}

export interface INotificationState {
  notifications: INotification[]

  fetchNotifications: typeof fetchNotifications
  addNotification: typeof addNotification
  removeNotification: typeof removeNotification
  clearNotifications: typeof clearNotifications
}
