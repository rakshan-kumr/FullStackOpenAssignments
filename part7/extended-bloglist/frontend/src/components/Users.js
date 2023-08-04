import React from 'react'
import { Link } from 'react-router-dom'
import './Users.css'
import { useUsers } from '../context/UsersContext'


const Users = () => {

  const users = useUsers()

  if (!users) {
    return null
  }

  return (
    <>
      <h3>Users</h3>
      <div className="row">
        <strong className="column">Name</strong>
        <strong className="column">Blogs created</strong>
      </div>
      {users.map(user => {
        return (
          <div key={user.id} className="row">
            <Link to={`/users/${user.id}`} className="column">{user.name}</Link>
            <div className="column">{user.blogs.length}</div>
          </div>
        )
      })}</>

  )
}

export default Users

