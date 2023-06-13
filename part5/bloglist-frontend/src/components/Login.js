const Login = ( {username, password, onChange, onSubmit} ) => (
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

export default Login