import { User } from "@/types/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserFromCookie(): Promise<User | null> {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  try {
    const { sub, username } = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      username: string;
    };

    return { _id: sub, username };
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
