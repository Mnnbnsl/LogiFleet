import { errorResponse } from "../utils/response.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        "FORBIDDEN",
        "You do not have permission to perform this action",
        403
      );
    }
    next();
  };
};
