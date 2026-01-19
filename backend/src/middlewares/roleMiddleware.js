/**
 * Role-based Authorization Middleware
 */

/**
 * Check if user has required permission (scope)
 * @param {string} requiredScope - The required scope (e.g., 'manage:products')
 */
export const authorize = (requiredScope) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const userScopes = req.user.scopes || [];

    if (!userScopes.includes(requiredScope)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requried scope: ${requiredScope}`,
      });
    }

    next();
  };
};

/**
 * Legacy Role Check (Deprecated: Use authorize with scopes where possible)
 * Checks if user has required role(s) to access the route
 */
export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        requiredRoles: allowedRoles,
        userRole: userRole,
      });
    }

    next();
  };
};

// Specific role middlewares for backward compatibility
export const adminOnly = roleMiddleware('ADMIN');
export const expertOnly = roleMiddleware('EXPERT', 'ADMIN');
export const customerOnly = roleMiddleware('CUSTOMER', 'ADMIN');
export const shipperOnly = roleMiddleware('SHIPPER', 'ADMIN');

export default { authorize, roleMiddleware };
