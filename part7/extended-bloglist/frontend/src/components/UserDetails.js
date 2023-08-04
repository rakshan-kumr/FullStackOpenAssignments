import React from 'react'
import { useParams } from 'react-router-dom'
import { useUsers } from '../context/UsersContext'

const UserDetails = () => {
  const { id } = useParams()
  const users = useUsers()
  const user = users.find((user) => user.id === id)

  return (
    <div>
      <h3>{user.name}</h3>
      <h4>added blogs</h4>
      <ul>
        {user.blogs.length ? (
          user.blogs.map((blog) => {
            return <li key={blog.id}>{blog.title}</li>
          })
        ) : (
          <p>No Blogs found</p>
        )}
      </ul>
    </div>
  )
}

export default UserDetails
