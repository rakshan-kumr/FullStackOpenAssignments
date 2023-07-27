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

export const setNotification = (message, duration) => async (dispatch) => {
  dispatch(setNotifMessage(message))
  setTimeout(() => {
    dispatch(setNotifMessage(''))
  }, duration * 1000)
}

export const { setNotifMessage } = notificationSlice.actions
export default notificationSlice.reducer
