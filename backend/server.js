require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const { attachUser } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const submissionRoutes = require("./routes/submissions");
const uploadRoutes = require("./routes/uploads");

const REQUIRED_ENV = ["DATABASE_URL", "JWT_SECRET"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
}

const uploadDir = process.env.UPLOAD_DIR || "uploads";
for (const category of [
  "grievance-attachments", "grievance-acknowledgements", "grievance-videos",
  "complaint-supporting", "complaint-leader-photos", "social-media-files",
]) {
  fs.mkdirSync(path.join(uploadDir, category), { recursive: true });
}

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || false,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(attachUser);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const submissionLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/submissions", submissionLimiter, submissionRoutes);
app.use("/api/uploads", uploadRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
