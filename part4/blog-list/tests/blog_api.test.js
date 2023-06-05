// const mongoose = require("mongoose");
// const supertest = require("supertest");
// const app = require("../app");

// const api = supertest(app);

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "First Test blog",
    author: "Me",
    url: "http://www.myfirsttestblog.com",
    likes: 55,
  },
  {
    title: "Second Test blog",
    author: "Me",
    url: "http://www.mysecondtestblog.com",
    likes: 87,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
}, 100000);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blogs contain id property", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
