const express = require("express");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");
const {
  signSession,
  setSessionCookie,
  clearSessionCookie,
} = require("../middleware/auth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, mobile, gender, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      `insert into users (name, email, mobile, gender, password_hash)
       values ($1, $2, $3, $4, $5)
       returning id, name, email, mobile, gender, role`,
      [name || null, email, mobile || null, gender || null, passwordHash]
    );
    const user = result.rows[0];
    setSessionCookie(res, signSession(user));
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const result = await pool.query(
    `select id, name, email, mobile, gender, role, password_hash from users where email = $1`,
    [email]
  );
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  delete user.password_hash;
  setSessionCookie(res, signSession(user));
  res.json({ user });
});

router.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

router.get("/me", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not signed in" });
  const result = await pool.query(
    `select id, name, email, mobile, gender, role from users where id = $1`,
    [req.user.id]
  );
  if (!result.rows[0]) return res.status(401).json({ error: "Not signed in" });
  res.json({ user: result.rows[0] });
});

module.exports = router;
