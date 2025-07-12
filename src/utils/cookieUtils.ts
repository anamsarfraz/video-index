// src/utils/cookieUtils.ts
import Cookies from "js-cookie";
import { v4 as uuid4 } from "uuid";

const SESSION_COOKIE_NAME = "session_token";

export const getUserSessionId = (): string => {
  let sessionId = Cookies.get(SESSION_COOKIE_NAME);

  if (!sessionId) {
    sessionId = uuid4();
    Cookies.set(SESSION_COOKIE_NAME, sessionId, {
      expires: 30,
      secure: true,
      sameSite: "None", // Required for cross-site
      domain: ".videoindex.app", // 👈 Add your common parent domain
    });
  }

  return sessionId;
};
