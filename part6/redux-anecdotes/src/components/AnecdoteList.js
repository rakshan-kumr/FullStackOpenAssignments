import { useSelector, useDispatch } from 'react-redux'
import { upVote } from '../reducers/anecdoteReducer'
import { setNotifMessage } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const filteredAnecdote = anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter)
    )
    return filteredAnecdote
  })

  const sortedAnecdotes = anecdotes.sort((a, b) => a.votes - b.votes)

  const dispatch = useDispatch()
  const vote = (id) => {
    console.log('vote', id)
    const votedAnecdote = anecdotes.find((anecdote) => anecdote.id === id)
    dispatch(upVote(id))
    dispatch(setNotifMessage(`You voted "${votedAnecdote.content}"`))
    setTimeout(() => {
      dispatch(setNotifMessage(null))
    }, 5000)
  }
  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
