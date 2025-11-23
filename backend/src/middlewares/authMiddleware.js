const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization || '';

    // Expecting header: "Authorization: Bearer <token>"
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = parts[1]

  try{
    const payload = jwt.verify(token, JWT_SECRET);
    // Attach user info to request
    req.user = {
        userId: payload.userId,
        orgId: payload.orgId,
    }
    next(); // go to next middleware/route
  } catch(err){
    console.error('JWT error', err);
    return res.status(401).json({message: 'Invalid or expired token'})
  }
}

module.exports = {authMiddleware};