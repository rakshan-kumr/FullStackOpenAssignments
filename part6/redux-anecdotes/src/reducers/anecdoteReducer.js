import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push({
        content: action.payload,
        id: getId(),
        votes: 0,
      })
    },
    upVote(state, action) {
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
