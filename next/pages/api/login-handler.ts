// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { LoginTicket, OAuth2Client } from "google-auth-library";
import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleAuth } from "google-auth-library";

type ErrorData = {
  error: string;
};

interface SignInWithGooglePostBody {
  credential: string;
  g_csrf_token: string;
}

const isSignInWithGooglePostBody = (
  body: any
): body is SignInWithGooglePostBody => {
  return (
    typeof body === "object" && "credential" in body && "g_csrf_token" in body
  );
};

const verifyIdToken = async (
  client: OAuth2Client,
  expectedOAuthClientId: string,
  body: SignInWithGooglePostBody
): Promise<LoginTicket | null> => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: body.credential,
      audience: expectedOAuthClientId,
    });
    return ticket;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fetchIdToken = async (targetAudience: string): Promise<string> => {
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(targetAudience);
  const token = await client.idTokenProvider.fetchIdToken(targetAudience);
  console.log("fetchIdToken for session token", token);
  return token;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  const body = req.body;
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  } else if (!isSignInWithGooglePostBody(body)) {
    return res.status(401).json({ error: "unauthorized" });
  }

  console.log("Verify CSRF token");
  const csrf_token_cookie = req.cookies["g_csrf_token"];
  if (!csrf_token_cookie) {
    return res.status(401).json({ error: "unauthorized" });
  } else if (csrf_token_cookie !== body.g_csrf_token) {
    return res.status(401).json({ error: "unauthorized" });
  }

  console.log("Verify ID token");
  const googleOAuth2ClientId = process.env.GOOGLE_OAUTH2_CLIENT_ID;
  const baseUrl = process.env.BASE_URL;
  if (!googleOAuth2ClientId || !baseUrl) {
    return res.status(500).json({ error: "internal server error" });
  }

  const client = new OAuth2Client(googleOAuth2ClientId);
  const ticket = await verifyIdToken(client, googleOAuth2ClientId, body);
  if (!ticket) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const session_token =
    process.env.NODE_ENV === "production"
      ? await fetchIdToken(baseUrl)
      : body.credential;

  if (!session_token) {
    return res.status(500).json({ error: "internal server error" });
  }

  res.setHeader(
    "Set-Cookie",
    `id_token=${session_token}; SameSite=Lax; Secure; HttpOnly; Path=/;`
  );

  return res.redirect("/");
}
