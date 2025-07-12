// src/utils/cookieUtils.ts
import Cookies from "js-cookie";
import { v4 as uuid4 } from "uuid";

const SESSION_COOKIE_NAME = "session_token";

export const getUserSessionId = (): string => {
  let sessionId = Cookies.get(SESSION_COOKIE_NAME);

  if (!sessionId) {
    sessionId = uuid4();
    Cookies.set(SESSION_COOKIE_NAME, sessionId, {
      expires: 30, // Cookie expires in 30 days
      secure: true, // Only send cookie over HTTPS
      sameSite: "None", // Allow cookie to be sent with cross-site requests
    });
  }

  return sessionId;
};
