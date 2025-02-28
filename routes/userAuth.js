const jwt = require('jsonwebtoken')

const authenticationToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] //baerer token
  if (token == null) {
    return res.status(401).json({ message: 'authentication token required' })
  }
  jwt.verify(token, 'bookstore121', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'token expired sign in aggain' })
    }
    req.user = user
    next()
  })
}
module.exports = { authenticationToken }
