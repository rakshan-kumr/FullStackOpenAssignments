const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((prev, current) => prev + current.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  let maxLike =  Math.max(...blogs.map((blog) => blog.likes))
  return blogs.find(blog => blog.likes === maxLike)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}