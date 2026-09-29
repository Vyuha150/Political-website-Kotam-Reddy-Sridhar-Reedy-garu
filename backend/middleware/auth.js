const jwt = require("jsonwebtoken");

const COOKIE_NAME = "session";

function signSession(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

// Populates req.user when a valid session cookie is present; never rejects
// the request, since most routes here allow anonymous access.
function attachUser(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    // expired/invalid token: treat as anonymous
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

module.exports = {
  COOKIE_NAME,
  signSession,
  setSessionCookie,
  clearSessionCookie,
  attachUser,
  requireAdmin,
};
