import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotifMessage(state, action) {
      return action.payload
    },
  },
})

export const { setNotifMessage } = notificationSlice.actions
export default notificationSlice.reducer
