export const setMessage = (message) => {
  return {
    type: 'NOTIFY',
    payload: message
  }
}