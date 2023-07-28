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

export const createNewAnecdote = (content) => async (dispatch) => {
  const newAnecdote = await anecdoteService.createNew(content)
  dispatch(createAnecdote(newAnecdote))
}

export const voteAnecdote = (id, anecdote) => async (dispatch) => {
  await anecdoteService.updateVote(id, anecdote)
  dispatch(upVote(id))
}

export default anecdoteSlice.reducer
