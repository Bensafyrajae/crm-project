// Middleware pour vérifier si l'utilisateur est un employeur
export const isEmployer = (req, res, next) => {
    if (req.user && req.user.role === 'employer') {
      next();  // Si l'utilisateur est un employeur, il peut accéder à la route
    } else {
      res.status(403).json({ message: 'Not authorized as an employer' });
    }
  };
  
  // Middleware pour vérifier si l'utilisateur est un manager
  export const isManager = (req, res, next) => {
    if (req.user && req.user.role === 'manager') {
      next();  // Si l'utilisateur est un manager, il peut accéder à la route
    } else {
      res.status(403).json({ message: 'Not authorized as a manager' });
    }
  };
  