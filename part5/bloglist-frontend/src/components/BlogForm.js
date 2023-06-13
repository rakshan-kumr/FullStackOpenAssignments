const BlogForm = ({ title, author, url, onChange, onSubmit }) => (
  <>
    <h2>create new</h2>
    <form onSubmit={onSubmit}>
      <div>
        title:
        <input id="title" type="text" value={title} onChange={onChange} />
      </div>
      <div>
        author:
        <input id="author" type="text" value={author} onChange={onChange} />
      </div>
      <div>
        url:
        <input id="url" type="text" value={url} onChange={onChange} />
      </div>
      <button type="submit">create</button>
    </form>
  </>
);

export default BlogForm;
