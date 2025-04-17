// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  let token;

  // Vérifier si l'en-tête Authorization existe et contient un token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Récupérer le token de l'en-tête
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token avec la clé secrète
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur à partir de l'ID dans le token
      req.user = await User.findById(decoded.id).select('-password');

      // Passer à la prochaine middleware ou route
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
