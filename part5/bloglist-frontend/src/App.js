import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Login from "./components/Login";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const changeHander = (event) => {
    if (event.target.id === "username") setUsername(event.target.value);
    if (event.target.id === "password") setPassword(event.target.value);
    // console.log(username, password)
  };

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedInUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
    }
  }, []);

  const loginHandler = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      setUser(user);
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log(exception);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  if (user === null)
    return (
      <Login
        username={username}
        password={password}
        onChange={changeHander}
        onSubmit={loginHandler}
      />
    );
  console.log(user);
  return (
    <div>
      <h2>blogs</h2>
      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
