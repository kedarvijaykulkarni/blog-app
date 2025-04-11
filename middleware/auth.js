import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};

export { auth, isAdmin };
