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

  let author = '';
  let blogsNum = -1;

  Object.keys(obj).forEach((key) => {
    if (obj[key] > blogsNum) {
      author = key;
      blogsNum = obj[key];
    }
  });

  return {
    author,
    blogs: blogsNum,
  };
};

const mostLikes = (blogs) => {
  const obj = {};

  for (let i = 0; i < blogs.length; i += 1) {
    if (obj[blogs[i].author] === undefined) {
      obj[blogs[i].author] = blogs[i].likes;
    } else {
      obj[blogs[i].author] += blogs[i].likes;
    }
  }

  let author = '';
  let likes = -1;

  Object.keys(obj).forEach((key) => {
    if (obj[key] > likes) {
      author = key;
      likes = obj[key];
    }
  });

  return {
    author,
    likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
