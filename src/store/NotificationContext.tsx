import React, { createContext, ReactElement, useReducer } from 'react'
import $api from '../http'
import { Role } from '../types/auth'
import { IAction } from '../types/companies'
import { INotificationState } from '../types/notifications'

const initialState: INotificationState = {
  notifications: [],

  fetchNotifications: () => {},
  addNotification: () => {},
  removeNotification: () => {},
  clearNotifications: () => {},
}

interface IProps {
  children?: ReactElement
}

const reducer = (
  state = initialState,
  { payload, type }: IAction
): INotificationState => {
  switch (type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: payload,
      }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, payload],
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== payload.id),
      }
    default:
      return state
  }
}

export const NotificationContext = createContext(initialState)

export const NotificationProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchNotifications = async () => {
    try {
      // fetch

      const resp = await $api.get('/api/notifications/get/')
      const notifications = resp.data

      if (!notifications.length) {
        notifications.push({
          id: -1,
          text: '',
        })
      }

      dispatch({
        type: 'SET_NOTIFICATIONS',
        payload: notifications,
      })
    } catch (e) {}
  }
  const addNotification = async (text: string) => {
    // fetch
    // get id from fetch

    await $api.post('/api/notifications/detail/', {
      text,
    })

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        text,
      },
    })
  }
  const removeNotification = async (id: number) => {
    // fetch
    // get id from fetch

    await $api.delete('/api/notifications/detail/', {
      data: {
        id,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    dispatch({
      type: 'REMOVE_NOTIFICATION',
      payload: {
        id,
      },
    })
  }
  const clearNotifications = () => {
    dispatch({
      type: 'SET_NOTIFICATIONS',
      payload: [],
    })
  }

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        fetchNotifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
