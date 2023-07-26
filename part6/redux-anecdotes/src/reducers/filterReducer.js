import { createSlice } from '@reduxjs/toolkit'

// const filterSlicer = (state = '', action) => {
//   state
//   switch (action.type) {
//     case 'FILTER_VALUE':
//       return action.payload
//     default:
//       return state
//   }
// }

// export const filterAnecdote = (value) => {
//   return {
//     type: 'FILTER_VALUE',
//     payload: value,
//   }
// }

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterAnecdote(state, action) {
      console.log(state)
      return action.payload
    },
  },
})

export const { filterAnecdote } = filterSlice.actions
export default filterSlice.reducer
