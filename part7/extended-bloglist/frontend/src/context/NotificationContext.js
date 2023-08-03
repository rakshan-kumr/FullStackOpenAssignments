import { createContext, useReducer } from 'react'

const messageReducer = (state, action) => {
  switch (action.type) {
  case 'NOTIFY':
    return action.payload
  default:
    return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(messageReducer, null)

  return (
    <NotificationContext.Provider value={[message, messageDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext