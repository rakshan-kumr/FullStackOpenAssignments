import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { NotificationContextProvider } from './context/NotificationContext'
import { UserContextProvider } from './context/UserContext'
import { UsersContextProvider } from './context/UsersContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <UsersContextProvider>
      <UserContextProvider>
        <NotificationContextProvider>
          <App />
        </NotificationContextProvider>
      </UserContextProvider>
    </UsersContextProvider>
  </QueryClientProvider>


)
