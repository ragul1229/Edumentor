// edumentor-backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

// Named export for authMiddleware (can be used for general route protection)
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Another named export specifically named verifyToken if your routes expect that
export const verifyToken = authMiddleware;
