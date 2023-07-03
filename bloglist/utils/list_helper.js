/* eslint-disable import/no-extraneous-dependencies */
const _ = require('lodash');

const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  const max = Math.max(...likes);
  const blog = blogs.find((article) => article.likes === max);

  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes,
  };
};

const mostBlogs = (blogs) => {
  const obj = {};

  blogs.forEach((element) => {
    if (obj[element.author] === undefined) {
      obj[element.author] = 1;
    } else {
      obj[element.author] += 1;
    }
  });

  const maxKey = _.max(Object.keys(obj), (o) => obj[o]);

  return {
    author: maxKey,
    blogs: obj[maxKey],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
