import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

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

export const initializeAnecdotes = () => async (dispatch) => {
  const anecdotes = await anecdoteService.getAll()
  dispatch(setAnecdote(anecdotes))
}

export default anecdoteSlice.reducer
