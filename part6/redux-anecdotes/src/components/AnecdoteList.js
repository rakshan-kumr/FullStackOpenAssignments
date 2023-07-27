import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const filteredAnecdote = anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter)
    )
    return filteredAnecdote
  })

  const sortedAnecdotes = anecdotes.sort((a, b) => a.votes - b.votes)

  const dispatch = useDispatch()
  const vote = async (id) => {
    console.log('vote', id)
    const votedAnecdote = anecdotes.find((anecdote) => anecdote.id === id)
    const updatedAnecdote = { ...votedAnecdote, votes: votedAnecdote.votes + 1 }

    dispatch(voteAnecdote(id, updatedAnecdote))
    dispatch(setNotification(`You voted "${updatedAnecdote.content}"`, 5))
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
