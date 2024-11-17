import axios from "axios";
import { Session, SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { BACEND_URL } from "./config";
import { cookies } from "next/headers";

interface user {
  id: string;
  email: string;
  token: string;
}

export interface session extends Session {
  user: {
    id: string;
    jwtToken: string;
    role: string;
    email: string;
  };
}

interface token extends JWT {
  uid: string;
  jwtToken: string;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials: any): Promise<user | null> {
        try {
          console.log(credentials);
          const response = await axios.post(`${BACEND_URL}/auth`, {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.status === 200) {
            (await cookies()).set("token", response.data.token);
            return response.data;
          }
          return null;
        } catch (err) {
          console.log(err);
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy },

  callbacks: {
    session: async ({ session, token }: any) => {
      console.log(token);
      console.log(session);
      const newSession: session = session as session;
      if (newSession.user && token.uid) {
        newSession.user.id = token.uid as string;
        newSession.user.jwtToken = token.jwtToken as string;
      }
      return newSession!;
    },
    jwt: async ({ token, user }: any): Promise<JWT> => {
      const newToken: token = token as token;

      if (user) {
        newToken.uid = user.id;
        newToken.jwtToken = (user as user).token;
      }

      console.log(newToken);
      return newToken;
    },
  },
};
