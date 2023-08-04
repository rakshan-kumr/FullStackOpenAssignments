import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

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
      <h4>Create new blog</h4>
      <Form onSubmit={createNewBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            id='title'
            type='text'
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
            }}
          />
          <Form.Label>author:</Form.Label>
          <Form.Control
            id='author'
            type='text'
            value={author}
            onChange={(event) => {
              setAuthor(event.target.value)
            }}
          />
          <Form.Label>url:</Form.Label>
          <Form.Control
            id='url'
            type='text'
            value={url}
            onChange={(event) => {
              setUrl(event.target.value)
            }}
          />
          <Button className='m-1' size='sm' type='submit' id='create-button'>
          create
          </Button>
        </Form.Group>
      </Form>
    </>
  )
}

export default BlogForm
