import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import samplePosts from "./data/sample-posts.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "temporary-development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (request, response) => {
  response.json({
    status: "ok",
    message: "Reddit Media Browser server is running."
  });
});
app.get("/api/reddit/status", (request, response) => {
const configured = Boolean(
  process.env.REDDIT_CLIENT_ID &&
  process.env.REDDIT_CLIENT_SECRET &&
  process.env.REDDIT_REDIRECT_URI &&
  process.env.REDDIT_USER_AGENT
);

  response.json({
    configured,
    authenticated: Boolean(request.session.redditAccessToken)
  });
});
app.get("/api/users/:username/posts", (request, response) => {
  const username = request.params.username.trim();

  if (!username) {
    return response.status(400).json({
      error: "A Reddit username is required."
    });
  }

  return response.json({
    username,
    source: "sample",
    posts: samplePosts
  });
});

app.use((request, response) => {
  response.status(404).json({
    error: "Not found"
  });
});

app.listen(port, () => {
  console.log(`Reddit Media Browser running at http://localhost:${port}`);
});
