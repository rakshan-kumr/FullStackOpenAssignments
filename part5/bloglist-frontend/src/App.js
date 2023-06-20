import { useState, useEffect, useRef } from "react";

import Blog from "./components/Blog";
import Login from "./components/Login";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(null);

  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

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
      setMessage("Wrong credentials");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const createNewBlog = async (event) => {
    event.preventDefault();
    try {
      const returnedBlog = await blogService.create({
        title,
        author,
        url,
      });

      blogFormRef.current.toggleVisibility();
      setBlogs(blogs.concat(returnedBlog));
      setMessage(`A new blog "${title}" by ${author} added`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (error) {
      setMessage("Something went wrong");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  const Notification = () => {
    if (message === null) {
      return null;
    }

    return <div className="message">{message}</div>;
  };

  if (user === null)
    return (
      <>
        <Notification />
        <Login
          username={username}
          password={password}
          onChange={changeHander}
          onSubmit={loginHandler}
        />
      </>
    );
  // console.log(user);
  return (
    <div>
      <h2>blogs</h2>
      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
      <Notification />
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm
          title={title}
          author={author}
          url={url}
          onChange={changeHander}
          onSubmit={createNewBlog}
        />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
