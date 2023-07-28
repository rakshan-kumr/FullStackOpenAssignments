import { useQuery, useMutation, useQueryClient } from 'react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { addAnecdote, getAnecdotes, updateAnecdote } from './requests'

const App = () => {
  const queryClient = useQueryClient()

  const getAnecdoteQuery = useQuery('anecdotes', getAnecdotes, {
    retry: false,
  })

  const addAnecdoteMutation = useMutation(addAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
  })

  const voteAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
  })

  if (getAnecdoteQuery.isLoading) return <p>Loading...</p>
  else if (
    getAnecdoteQuery.isError ||
    addAnecdoteMutation.isError ||
    voteAnecdoteMutation.isError
  )
    return <p>Anecdote service not available due to problems in server</p>

  const handleVote = (anecdote) => {
    console.log({ ...anecdote, votes: anecdote.votes + 1 })
    voteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const anecdotes = getAnecdoteQuery.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm addAnecdoteMutation={addAnecdoteMutation} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
