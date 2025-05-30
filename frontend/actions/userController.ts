"use server";

import { SignupRequest, LoginRequest } from "@/types/AuthRequest";
import { ServerActionResponse } from "@/types/ServerResponse";
import { getCollection } from "@/lib/db";
import { validateSignupInput } from "@/lib/validators/signupValidator";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/types/User"; 

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

export const signup = async (data: SignupRequest): Promise<ServerActionResponse<User>> => {
  const errors = validateSignupInput(data);

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: "Validation failed",
    };
  }

  // Check if username already exists
  const usersCollection = await getCollection("users");
  const existingUser = await usersCollection.findOne({ username: data.username });
  if (existingUser) {
    return {
      success: false,
      errors: { username: "Username already exists." },
      message: "User already exists",
    };
  }

  // Hash the password before storing
  const hashedPassword = await hashPassword(data.password);
  const result = await usersCollection.insertOne({
    username: data.username,
    password: hashedPassword,
    createdAt: new Date(),
  });

  if (!result.acknowledged) {
    return {
      success: false,
      message: "Failed to create user",
    };
  }

  // Create user object to return
  const newUser: User = {
    _id: result.insertedId.toString(),
    username: data.username,  
  };

  // Generate JWT token
  const token = jwt.sign({ sub: newUser._id, username: newUser.username }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  // Set the token in cookies
  (await cookies()).set("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    secure: true,
  });

  return {
    success: true,
    message: "Signup successful",
    data: newUser,
  };
};

export const login = async (data: LoginRequest): Promise<ServerActionResponse<User>> => {
  const usersCollection = await getCollection("users");
  const user = await usersCollection.findOne({ username: data.username });

  if (!user) {
    return {
      success: false,
      errors: { username: "User not found." },
      message: "Login failed"
    };
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    return {
      success: false,
      errors: { password: "Invalid password." },
      message: "Login failed"
    };
  }

  // Set cookie with JWT token
  const token = jwt.sign({ sub: user._id.toString(), username: user.username }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  (await cookies()).set("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, 
    secure: true, 
  });

  // Here you would typically set a session or token for the user
  return {
    success: true,
    message: "Login successful",
  };
}

export const logout = async () => {
  const cookieStore = cookies();
  (await cookieStore).set("token", "", {
    maxAge: 0,
    path: "/",
  }); 
  
};