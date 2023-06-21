import PropTypes from 'prop-types'

const Login = ( { username, password, onChange, onSubmit } ) => (
  <div>
    <h2>Login to the Application</h2>
    <form onSubmit={onSubmit}>
      <div>
            username
        <input id="username" type="text" value={username} onChange={onChange}/>
      </div>
      <div>
            password
        <input id="password" type="text" value={password} onChange={onChange}/>
      </div>
      <button>login</button>
    </form>
  </div>
)

Login.propTypes = {
  username: PropTypes.string.isRequired,
  password:PropTypes.string.isRequired,
  onChange:PropTypes.func.isRequired,
  onSubmit:PropTypes.func.isRequired
}

export default Login