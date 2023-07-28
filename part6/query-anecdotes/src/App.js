import { useQuery, useMutation, useQueryClient } from 'react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { addAnecdote, getAnecdotes, updateAnecdote } from './requests'
import { notifDispatch, useNotifDispatch } from './NotificationContext'

const App = () => {
  const dispatch = useNotifDispatch()
  const queryClient = useQueryClient()

  const getAnecdoteQuery = useQuery('anecdotes', getAnecdotes, {
    retry: false,
  })

  const addAnecdoteMutation = useMutation(addAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
    onError: () => {
      setNotif('too short anecdote, must have length 5 or more')
    },
  })

  const voteAnecdoteMutation = useMutation(updateAnecdote)

  console.log(voteAnecdoteMutation)

  const handleVote = (anecdote) => {
    console.log({ ...anecdote, votes: anecdote.votes + 1 })
    voteAnecdoteMutation.mutate(
      { ...anecdote, votes: anecdote.votes + 1 },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('anecdotes')
          setNotif(`Anecdote "${anecdote.content}" voted`)
        },
      }
    )
  }

  const setNotif = (message) => {
    dispatch(notifDispatch(message))
    setTimeout(() => {
      dispatch(notifDispatch(''))
    }, 5000)
  }
  if (getAnecdoteQuery.isLoading) return <p>Loading...</p>
  else if (getAnecdoteQuery.isError || voteAnecdoteMutation.isError)
    return <p>Anecdote service not available due to problems in server</p>

  const anecdotes = getAnecdoteQuery.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm
        addAnecdoteMutation={addAnecdoteMutation}
        setNotif={setNotif}
      />

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
