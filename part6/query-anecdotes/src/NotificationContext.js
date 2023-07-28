import React, { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

export const useNotifValue = () => {
  const messageAndDispatch = useContext(NotificationContext)
  return messageAndDispatch[0]
}

export const useNotifDispatch = () => {
  const messageAndDispatch = useContext(NotificationContext)
  return messageAndDispatch[1]
}

export const notifDispatch = (message) => {
  return {
    type: 'NOTIFY',
    payload: message,
  }
}

const notifMessageReducer = (state, action) => {
  switch (action.type) {
    case 'NOTIFY':
      return action.payload
    default:
      return action.payload
  }
}

export const NotificationContextProvider = (props) => {
  const [notifMessage, notifMessageDispatch] = useReducer(notifMessageReducer)
  return (
    <NotificationContext.Provider value={[notifMessage, notifMessageDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
