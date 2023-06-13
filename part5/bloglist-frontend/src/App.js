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

  const loginHandler = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log(exception);
    }
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
      <p>{user.name} logged in</p>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
