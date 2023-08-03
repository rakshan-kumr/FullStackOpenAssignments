import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserService from '../services/users'
import './Users.css'


const Users = () => {

  const [users, setUsers] = useState([])

  useEffect(() => {
    UserService.getAllUsers().then(userList => setUsers(userList))
  }, [users])


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
            <Link className="column">{user.name}</Link>
            <div className="column">{user.blogs.length}</div>
          </div>
        )
      })}</>

  )
}

export default Users

