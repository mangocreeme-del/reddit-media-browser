import crypto from "node:crypto";

const REDDIT_AUTHORIZE_URL =
  "https://www.reddit.com/api/v1/authorize";

export function createOAuthState() {
  return crypto.randomBytes(32).toString("hex");
}

export function createRedditAuthorizationUrl(state) {
  const authorizationUrl = new URL(REDDIT_AUTHORIZE_URL);

  authorizationUrl.searchParams.set(
    "client_id",
    process.env.REDDIT_CLIENT_ID
  );

  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("state", state);

  authorizationUrl.searchParams.set(
    "redirect_uri",
    process.env.REDDIT_REDIRECT_URI
  );

  authorizationUrl.searchParams.set("duration", "permanent");

  authorizationUrl.searchParams.set(
    "scope",
    "identity read"
  );

  return authorizationUrl.toString();
}

