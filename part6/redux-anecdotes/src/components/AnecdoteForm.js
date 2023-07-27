import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotifMessage } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createNewAnecdote = async (event) => {
    event.preventDefault()
    const newAnecdote = await anecdoteService.createNew(
      event.target.anecdote.value
    )
    dispatch(createAnecdote(newAnecdote))

    dispatch(
      setNotifMessage(`You added anecdote "${event.target.anecdote.value}"`)
    )
    setTimeout(() => {
      dispatch(setNotifMessage(''))
    }, 5000)
    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createNewAnecdote}>
        <div>
          <input name='anecdote' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
