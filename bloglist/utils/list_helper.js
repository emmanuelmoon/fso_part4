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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
