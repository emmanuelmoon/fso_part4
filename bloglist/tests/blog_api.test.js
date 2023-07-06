const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs
    .map((blog) => Blog(blog));

  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
}, 100000);

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('blog has the property id', async () => {
  const response = await api.get('/api/blogs');

  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test('blog post is saved correctly', async () => {
  const newBlog = {
    title: 'npm audit: Broken by Design',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/npm-audit-broken-by-design/',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const contents = blogsAtEnd.map((b) => b.title);
  expect(contents).toContain(
    'npm audit: Broken by Design',
  );
});

test('likes default to zero when the field is missing', async () => {
  const newBlog = {
    title: 'npm audit: Broken by Design',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/npm-audit-broken-by-design/',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const blogs = blogsAtEnd.map((blog) => ({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
  }));

  expect(blogs).toContainEqual({
    title: 'npm audit: Broken by Design',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/npm-audit-broken-by-design/',
    likes: 0,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
}, 100000);
