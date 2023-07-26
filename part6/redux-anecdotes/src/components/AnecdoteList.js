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
  const notification = useSelector(({ notification }) => notification)
  console.log(notification)
  const dispatch = useDispatch()

  const sortedAnecdotes = anecdotes.sort((a, b) => a.votes - b.votes)

  const vote = (id) => {
    console.log('vote', id)
    dispatch(upVote(id))
    dispatch(setNotifMessage('Voted'))
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
