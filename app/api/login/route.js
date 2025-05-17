// app/api/login/route.js
import crypto from "crypto";
import { cognitoClient } from "@/lib/aws-config";
import {
  InitiateAuthCommand,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const clientId     = process.env.COGNITO_CLIENT_ID;
const clientSecret = process.env.COGNITO_CLIENT_SECRET;
const userPoolId   = process.env.COGNITO_USER_POOL_ID;

function makeSecretHash(username) {
  if (!clientId || !clientSecret) {
    throw new Error("Cognito client ID/secret not set in environment");
  }
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export async function POST(req) {
  const { username: rawUsername, password: rawPassword } = await req.json();
  const username = rawUsername?.trim();
  const password = rawPassword?.trim();

  if (!username || !password) {
    return new Response(
      JSON.stringify({ message: "Username and password required" }),
      { status: 400 }
    );
  }

  const secretHash = makeSecretHash(username);

  const authParams = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME:    username,
      PASSWORD:    password,
      SECRET_HASH: secretHash,
    },
  };

  try {
    // 1) First auth attempt
    let response = await cognitoClient.send(new InitiateAuthCommand(authParams));

    // 2) If user must set a new password, do it as admin (using your existing cognitoClient)
    if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      await cognitoClient.send(
        new AdminSetUserPasswordCommand({
          UserPoolId: userPoolId,
          Username:   username,
          Password:   password,
          Permanent:  true,
        })
      );

      // retry login
      response = await cognitoClient.send(new InitiateAuthCommand(authParams));
    }

    // 3) Final result
    const result = response.AuthenticationResult;
    if (!result) {
      // any other challenge?
      return new Response(
        JSON.stringify({
          message:   "Auth challenge returned",
          challenge: response.ChallengeName,
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Login successful",
        tokens: {
          idToken:     result.IdToken,
          accessToken: result.AccessToken,
          refreshToken: result.RefreshToken,
        },
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Login error:", err);
    return new Response(
      JSON.stringify({ message: "Login failed", error: err.message }),
      { status: 401 }
    );
  }
}
