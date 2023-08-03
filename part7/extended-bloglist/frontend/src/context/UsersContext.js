import { createContext, useContext, useReducer } from 'react'

const usersReducer = (state, action) => {
  switch (action.type) {
  case 'FETCH_USERS':
    return action.payload
  default:
    return state
  }
}

const UsersContext = createContext()

export const useUsers = () => {
  const usersAndDispatch = useContext(UsersContext)
  return usersAndDispatch[0]
}

export const useUsersDispatch = () => {
  const usersAndDispatch = useContext(UsersContext)
  return usersAndDispatch[1]
}

export const UsersContextProvider = (props) => {
  const [users, usersDispatch] = useReducer(usersReducer, null)

  return (
    <UsersContext.Provider value={[users, usersDispatch] }>
      {props.children}
    </UsersContext.Provider>
  )
}

export default UsersContext