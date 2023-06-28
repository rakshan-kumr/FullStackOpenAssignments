const filterReducer = (state = '', action) => {
  state
  switch (action.type) {
  case 'FILTER_VALUE':
    return action.payload
  default:
    return state
  }
}

export const filterAnecdote = (value) => {
  return {
    type: 'FILTER_VALUE',
    payload: value,
  }
}

export default filterReducer
