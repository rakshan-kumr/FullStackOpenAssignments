import { useState } from "react";

const Blog = ({ blog }) => {
  const [blogDetailVisible, setBlogDetailVisible] = useState(false);

  const buttonLabel = blogDetailVisible ? "hide" : "view";

  const toggleVisibility = () => {
    setBlogDetailVisible(!blogDetailVisible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  // console.log(blog);

  const blogDetail = () => (
    <>
      <p>{blog.url}</p>
      <p>
        likes 0 <button>like</button>
      </p>

      <p>{blog.user.name}</p>
    </>
  );

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      {blogDetailVisible ? blogDetail() : null}
    </div>
  );
};

export default Blog;
