import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    upVote(state, action) {
      console.log(action.payload)
      const updatedState = state.map((obj) =>
        obj.id !== action.payload ? obj : { ...obj, votes: obj.votes + 1 }
      )
      return updatedState
    },
    setAnecdote(state, action) {
      return action.payload
    },
  },
})

export const { createAnecdote, upVote, setAnecdote } = anecdoteSlice.actions

export default anecdoteSlice.reducer
