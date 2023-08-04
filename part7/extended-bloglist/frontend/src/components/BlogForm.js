import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createNewBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={createNewBlog}>
        <div>
          title:
          <input
            id='title'
            type='text'
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
            }}
          />
        </div>
        <div>
          author:
          <input
            id='author'
            type='text'
            value={author}
            onChange={(event) => {
              setAuthor(event.target.value)
            }}
          />
        </div>
        <div>
          url:
          <input
            id='url'
            type='text'
            value={url}
            onChange={(event) => {
              setUrl(event.target.value)
            }}
          />
        </div>
        <button type='submit' id='create-button'>
          create
        </button>
      </form>
    </>
  )
}

export default BlogForm
