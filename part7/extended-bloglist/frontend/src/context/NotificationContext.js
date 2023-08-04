import { createContext, useContext, useReducer } from 'react'

const messageReducer = (state, action) => {
  switch (action.type) {
  case 'NOTIFY':
    return action.payload
  default:
    return state
  }
}

const NotificationContext = createContext()

export const useMessage = () => {
  const messageAndDispatch = useContext(NotificationContext)
  return messageAndDispatch[0]
}

export const useMessageDispatch = () => {
  const messageAndDispatch = useContext(NotificationContext)
  return messageAndDispatch[1]
}

export const useNotifier = () => {
  const dispatch = useContext(NotificationContext)[1]

  return (message) => {
    dispatch({
      type: 'NOTIFY',
      payload: message
    })
    setTimeout(() => {
      dispatch({
        type: 'NOTIFY',
        payload: null
      })
    }, 5000)
  }}

export const NotificationContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(messageReducer, null)

  return (
    <NotificationContext.Provider value={[message, messageDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext