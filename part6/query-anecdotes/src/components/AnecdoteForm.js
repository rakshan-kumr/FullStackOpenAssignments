const AnecdoteForm = ({ addAnecdoteMutation }) => {
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    addAnecdoteMutation.mutate({ content, votes: 0 })
    event.target.anecdote.value = ''
    console.log('new anecdote')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
