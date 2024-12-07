const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
function authenticateJWT(req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  
  if (!token) {
    return res.status(403).send('Access denied');
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.user = decoded;
    next();
  });
}

module.exports = authenticateJWT;
