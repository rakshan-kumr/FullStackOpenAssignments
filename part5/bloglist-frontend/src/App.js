import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Login from "./components/Login";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const [user, setUser] = useState(null);

  const changeHander = (event) => {
    switch (event.target.id) {
      case "username":
        setUsername(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      case "title":
        setTitle(event.target.value);
        break;
      case "author":
        setAuthor(event.target.value);
        break;
      case "url":
        setUrl(event.target.value);
        break;

      default:
        break;
    }

    // console.log(username, password)
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedInUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      blogService.setToken(user.token);
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
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log(exception);
    }
  };

  const createNewBlog = async (event) => {
    event.preventDefault();
    const returnedBlog = await blogService.create({
      title,
      author,
      url,
    });

    setBlogs(blogs.concat(returnedBlog));
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const logout = () => {
    window.localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  if (user === null)
    return (
      <Login
        username={username}
        password={password}
        onChange={changeHander}
        onSubmit={loginHandler}
      />
    );
  // console.log(user);
  return (
    <div>
      <h2>blogs</h2>
      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
      <BlogForm
        title={title}
        author={author}
        url={url}
        onChange={changeHander}
        onSubmit={createNewBlog}
      />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
